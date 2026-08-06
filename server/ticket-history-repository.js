export function createTicketHistoryRepository({ delayMs = 850 } = {}) {
  const eventsByTicket = new Map([
    [
      "TCK-1088",
      [
        { at: "09:02", label: "Ticket creato", actor: "Portale clienti" },
        { at: "09:08", label: "Priorità aggiornata ad alta", actor: "Giulia Rinaldi" },
        { at: "09:14", label: "Richiesto contatto telefonico", actor: "Support bot" }
      ]
    ],
    [
      "TCK-1085",
      [
        { at: "08:01", label: "Ticket creato", actor: "Email gateway" },
        { at: "08:19", label: "Allegato verificato", actor: "Marco Neri" }
      ]
    ]
  ]);

  return {
    async listByTicketId(ticketId) {
      await wait(delayMs);
      return eventsByTicket.get(ticketId) ?? [
        { at: "-", label: "Nessun evento aggiuntivo", actor: "Sistema" }
      ];
    }
  };
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
