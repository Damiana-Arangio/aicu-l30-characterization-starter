import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createTicketRepository } from "./ticket-repository.js";
import { createTicketService } from "./ticket-service.js";
import { createLegacySummaryProvider } from "./legacy-summary-provider.js";
import { createTicketHistoryRepository } from "./ticket-history-repository.js";
import { createTicketHistoryService } from "./ticket-history-service.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultRootDir = resolve(__dirname, "..");

export function createTicketApplication({
  rootDir = defaultRootDir,
  databasePath = join(defaultRootDir, "data", "tickets.sqlite"),
  summaryDelayMs = 480,
  summaryProvider = createLegacySummaryProvider({ delayMs: summaryDelayMs }),
  historyDelayMs = 850
} = {}) {
  const ticketRepository = createTicketRepository(databasePath);
  const ticketService = createTicketService({ ticketRepository, summaryProvider });
  const historyRepository = createTicketHistoryRepository({ delayMs: historyDelayMs });
  const ticketHistoryService = createTicketHistoryService({
    ticketRepository,
    historyRepository
  });

  const server = createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    try {
      if (request.method === "GET" && url.pathname === "/health") {
        sendJson(response, 200, { status: "ok" });
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/tickets") {
        sendJson(response, 200, {
          tickets: await ticketService.listTicketsWithSummary()
        });
        return;
      }

      const historyMatch = url.pathname.match(/^\/api\/tickets\/([^/]+)\/history$/);

      if (request.method === "GET" && historyMatch) {
        const history = await ticketHistoryService.getTicketHistory(
          decodeURIComponent(historyMatch[1])
        );

        if (!history) {
          sendJson(response, 404, {
            code: "TICKET_NOT_FOUND",
            message: "Ticket non trovato."
          });
          return;
        }

        sendJson(response, 200, history);
        return;
      }

      serveStatic(url.pathname, response, rootDir);
    } catch (error) {
      console.error({ operation: "request", message: error.message });
      sendJson(response, 500, {
        code: "INTERNAL_ERROR",
        message: "Errore interno del server."
      });
    }
  });

  return {
    server,
    async close() {
      if (server.listening) {
        await new Promise((resolveClose, rejectClose) => {
          server.close((error) => error ? rejectClose(error) : resolveClose());
        });
      }
      ticketRepository.close();
    }
  };
}

function serveStatic(pathname, response, rootDir) {
  const requestedPath = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = resolve(rootDir, requestedPath);
  const relativePath = relative(rootDir, filePath);

  if (relativePath.startsWith("..") || isAbsolute(relativePath) || !existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png"
  };

  response.writeHead(200, {
    "content-type": contentTypes[extname(filePath)] || "application/octet-stream"
  });
  response.end(readFileSync(filePath));
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}
