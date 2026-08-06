export function filterTickets(tickets, rawQuery) {
  const query = String(rawQuery ?? "").trim().toLocaleLowerCase("it");

  return tickets.filter((ticket) =>
    `${ticket.id} ${ticket.title} ${ticket.customer}`
      .toLocaleLowerCase("it")
      .includes(query)
  );
}

export function summarizeTickets(tickets) {
  return {
    total: tickets.length,
    highPriority: tickets.filter((ticket) => ticket.priority === "alta").length,
    requiresAttention: tickets.filter(
      (ticket) => ticket.urgencyLabel === "intervento rapido"
    ).length
  };
}
