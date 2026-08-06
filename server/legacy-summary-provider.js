export function createLegacySummaryProvider({ delayMs = 480 } = {}) {
  return {
    async getSummary(ticket) {
      await wait(delayMs);

      const summaries = {
        alta: "Verifica immediata e contatto con il cliente",
        normale: "Analisi nel prossimo ciclo operativo",
        bassa: "Richiesta pianificabile senza escalation"
      };

      return summaries[ticket.priority] ?? "Riepilogo da verificare";
    }
  };
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
