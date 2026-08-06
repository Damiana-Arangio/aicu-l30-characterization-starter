import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createTicketApplication } from "../../server/app.js";

export async function startApplication(t, options = {}) {
  const directory = mkdtempSync(join(tmpdir(), "aicu-l30-"));
  const application = createTicketApplication({
    databasePath: join(directory, "tickets.sqlite"),
    summaryDelayMs: 0,
    historyDelayMs: 0,
    ...options
  });

  await new Promise((resolveListen) => {
    application.server.listen(0, "127.0.0.1", resolveListen);
  });

  t.after(() => application.close());
  const address = application.server.address();
  return `http://127.0.0.1:${address.port}`;
}
