export function createTicketService({ ticketRepository, summaryProvider }) {
  return {
    async listTicketsWithSummary() {
      const tickets = ticketRepository.listTickets();
      const enrichedTickets = [];

      for (const ticket of tickets) {
        const summary = await summaryProvider.getSummary(ticket);
        enrichedTickets.push({ ...ticket, summary });
      }

      return enrichedTickets;
    },
    getTicket(ticketId) {
      return ticketRepository.findTicketById(ticketId);
    }
  };
}
