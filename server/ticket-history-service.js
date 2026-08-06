export function createTicketHistoryService({ ticketRepository, historyRepository }) {
  return {
    async getTicketHistory(ticketId) {
      const ticket = ticketRepository.findTicketById(ticketId);

      if (!ticket) {
        return null;
      }

      const events = await historyRepository.listByTicketId(ticketId);
      return { ticketId, events };
    }
  };
}
