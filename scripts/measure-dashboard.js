import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { performance } from "node:perf_hooks";

import { createTicketApplication } from "../server/app.js";

const directory = mkdtempSync(join(tmpdir(), "aicu-l30-measure-"));
const application = createTicketApplication({
  databasePath: join(directory, "tickets.sqlite")
});

await new Promise((resolveListen) => {
  application.server.listen(0, "127.0.0.1", resolveListen);
});

try {
  const address = application.server.address();
  const startedAt = performance.now();
  const response = await fetch(`http://127.0.0.1:${address.port}/api/tickets`);
  const elapsedMs = performance.now() - startedAt;

  console.log(`GET /api/tickets -> ${response.status}`);
  console.log(`Tempo osservato: ${Math.round(elapsedMs)} ms`);
  console.log("Misura informativa: non e' una soglia del test funzionale.");
} finally {
  await application.close();
}
