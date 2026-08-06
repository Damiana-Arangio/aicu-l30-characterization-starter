import assert from "node:assert/strict";
import test from "node:test";

import { startApplication } from "../helpers/start-application.js";

test("GET /api/tickets returns the seeded dashboard tickets", async (t) => {
  const baseUrl = await startApplication(t);
  const response = await fetch(`${baseUrl}/api/tickets`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.tickets.length, 6);
  assert.equal(payload.tickets[0].id, "TCK-1088");
  assert.equal(
    payload.tickets[0].summary,
    "Verifica immediata e contatto con il cliente"
  );
});

test("GET /api/tickets/:id/history returns the detail timeline", async (t) => {
  const baseUrl = await startApplication(t);
  const response = await fetch(`${baseUrl}/api/tickets/TCK-1088/history`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.ticketId, "TCK-1088");
  assert.equal(payload.events.length, 3);
});
