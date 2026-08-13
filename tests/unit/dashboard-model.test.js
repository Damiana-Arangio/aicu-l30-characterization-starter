import assert from "node:assert/strict";
import test from "node:test";

import {
  filterTickets,
  summarizeTickets,
} from "../../src/dashboard-model.js";

test("filterTickets keeps matching independent from uppercase and surrounding spaces", () => {
  const tickets = [
    {
      id: "TCK-1088",
      title: "Accesso bloccato dopo reset password",
      customer: "Alfa S.r.l.",
    },
    {
      id: "TCK-1087",
      title: "Esportazione report incompleta",
      customer: "Beta Consulting",
    },
  ];

  const result = filterTickets(tickets, "  ALFA  ");

  assert.deepEqual(
    result.map((ticket) => ticket.id),
    ["TCK-1088"]
  );
});

test("summarizeTickets returns zero counts for an empty ticket list", () => {
  const result = summarizeTickets([]);

  assert.deepEqual(result, {
    total: 0,
    highPriority: 0,
    requiresAttention: 0,
  });
});
