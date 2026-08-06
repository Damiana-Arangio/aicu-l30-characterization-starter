import { filterTickets, summarizeTickets } from "./dashboard-model.js";

const elements = {
  totalCount: document.querySelector("#total-count"),
  highCount: document.querySelector("#high-count"),
  attentionCount: document.querySelector("#attention-count"),
  loading: document.querySelector("#loading-state"),
  error: document.querySelector("#error-state"),
  tableWrap: document.querySelector("#ticket-table-wrap"),
  rows: document.querySelector("#ticket-rows"),
  reload: document.querySelector("#reload-button"),
  search: document.querySelector("#search-input"),
  dialog: document.querySelector("#detail-dialog"),
  detailTitle: document.querySelector("#detail-title"),
  detailContent: document.querySelector("#detail-content")
};

let tickets = [];

elements.reload.addEventListener("click", loadDashboard);
elements.search.addEventListener("input", renderTickets);
elements.rows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-ticket-id]");

  if (button) {
    openTicket(button.dataset.ticketId);
  }
});

await loadDashboard();

async function loadDashboard() {
  setDashboardState("loading");

  try {
    const response = await fetch("/api/tickets");

    if (!response.ok) {
      throw new Error(`GET /api/tickets: ${response.status}`);
    }

    const payload = await response.json();
    tickets = payload.tickets;
    renderSummary();
    renderTickets();
    setDashboardState("ready");
  } catch (error) {
    console.error(error);
    setDashboardState("error");
  }
}

function renderSummary() {
  const summary = summarizeTickets(tickets);

  elements.totalCount.textContent = String(summary.total);
  elements.highCount.textContent = String(summary.highPriority);
  elements.attentionCount.textContent = String(summary.requiresAttention);
}

function renderTickets() {
  const visibleTickets = filterTickets(tickets, elements.search.value);

  elements.rows.replaceChildren(
    ...visibleTickets.map((ticket) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="ticket-id">${escapeHtml(ticket.id)}</span></td>
        <td>
          <strong>${escapeHtml(ticket.title)}</strong>
          <span class="customer">${escapeHtml(ticket.customer)}</span>
        </td>
        <td><span class="badge priority-${ticket.priority}">${escapeHtml(ticket.priority)}</span></td>
        <td>${escapeHtml(ticket.sourceChannel)}</td>
        <td><span class="summary-text">${escapeHtml(ticket.summary ?? "-")}</span></td>
        <td><button class="link-button" type="button" data-ticket-id="${escapeHtml(ticket.id)}">Apri</button></td>
      `;
      return row;
    })
  );
}

async function openTicket(ticketId) {
  const ticket = tickets.find((item) => item.id === ticketId);

  elements.detailTitle.textContent = ticket?.title ?? ticketId;
  elements.detailContent.innerHTML = `
    <div class="detail-loading">
      <span class="spinner" aria-hidden="true"></span>
      <span>Caricamento cronologia...</span>
    </div>
  `;
  elements.dialog.showModal();

  try {
    const response = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/history`);

    if (!response.ok) {
      throw new Error(`GET ticket history: ${response.status}`);
    }

    const payload = await response.json();
    elements.detailContent.innerHTML = `
      <p>${escapeHtml(ticket?.description ?? "Descrizione non disponibile")}</p>
      <ol class="timeline">
        ${payload.events.map((event) => `
          <li>
            <span>${escapeHtml(event.at)}</span>
            <div>
              <strong>${escapeHtml(event.label)}</strong>
              <small>${escapeHtml(event.actor)}</small>
            </div>
          </li>
        `).join("")}
      </ol>
    `;
  } catch (error) {
    console.error(error);
    elements.detailContent.innerHTML = `
      <p>${escapeHtml(ticket?.description ?? "Descrizione non disponibile")}</p>
      <p class="detail-error">Cronologia non disponibile.</p>
    `;
  }
}

function setDashboardState(state) {
  elements.loading.hidden = state !== "loading";
  elements.error.hidden = state !== "error";
  elements.tableWrap.hidden = state !== "ready";
  elements.reload.disabled = state === "loading";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
