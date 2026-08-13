import assert from "node:assert/strict";
import test from "node:test";

import { startApplication } from "../helpers/start-application.js";

test("GET /api/tickets preserves the observable dashboard order", async (t) => {
  const baseUrl = await startApplication(t);
  const response = await fetch(`${baseUrl}/api/tickets`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(
    payload.tickets.map((ticket) => ticket.id),
    [
      "TCK-1088",
      "TCK-1087",
      "TCK-1086",
      "TCK-1085",
      "TCK-1084",
      "TCK-1083",
    ]
  );
});

// Percorso avanzato: affrontalo dopo i tre test essenziali.
test.todo("GET /api/tickets preserves the fields consumed by the dashboard");
