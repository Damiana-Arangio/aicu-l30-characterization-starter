import { DatabaseSync } from "node:sqlite";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";

export function createTicketRepository(databasePath) {
  mkdirSync(dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath);

  database.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      customer TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL,
      source_channel TEXT NOT NULL,
      urgency_label TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  seedTickets(database);

  return {
    listTickets() {
      return database.prepare(`
        SELECT
          id,
          title,
          customer,
          description,
          priority,
          source_channel AS sourceChannel,
          urgency_label AS urgencyLabel,
          status,
          created_at AS createdAt
        FROM tickets
        ORDER BY created_at DESC
      `).all();
    },
    findTicketById(ticketId) {
      return database.prepare(`
        SELECT
          id,
          title,
          customer,
          description,
          priority,
          source_channel AS sourceChannel,
          urgency_label AS urgencyLabel,
          status,
          created_at AS createdAt
        FROM tickets
        WHERE id = ?
      `).get(ticketId);
    },
    close() {
      database.close();
    }
  };
}

function seedTickets(database) {
  const count = database.prepare("SELECT COUNT(*) AS count FROM tickets").get().count;

  if (count > 0) {
    return;
  }

  const insert = database.prepare(`
    INSERT INTO tickets (
      id, title, customer, description, priority,
      source_channel, urgency_label, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tickets = [
    ["TCK-1088", "Accesso bloccato dopo reset password", "Alfa S.r.l.", "L'amministratore non riesce ad accedere dopo il reset.", "alta", "telefono", "intervento rapido", "aperto", "2026-08-04T08:44:00.000Z"],
    ["TCK-1087", "Esportazione report incompleta", "Beta Consulting", "Il report mensile non include gli ultimi ticket chiusi.", "normale", "email", "gestione programmata", "aperto", "2026-08-04T08:21:00.000Z"],
    ["TCK-1086", "Notifiche duplicate sul canale chat", "Gamma S.p.A.", "Ogni aggiornamento produce due messaggi identici.", "normale", "chat", "presa in carico", "in_lavorazione", "2026-08-04T07:58:00.000Z"],
    ["TCK-1085", "Fattura non disponibile", "Delta Service", "Il PDF della fattura di luglio restituisce errore.", "alta", "email", "intervento rapido", "aperto", "2026-08-04T07:31:00.000Z"],
    ["TCK-1084", "Richiesta aggiornamento anagrafica", "Epsilon Group", "Aggiornare il referente amministrativo.", "bassa", "whatsapp", "gestione programmata", "aperto", "2026-08-04T07:06:00.000Z"],
    ["TCK-1083", "Errore sincronizzazione catalogo", "Zeta Retail", "La sincronizzazione notturna non ha aggiornato i prezzi.", "alta", "telefono", "intervento rapido", "aperto", "2026-08-04T06:42:00.000Z"]
  ];

  for (const ticket of tickets) {
    insert.run(...ticket);
  }
}
