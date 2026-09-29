const API_BASE_URL = "http://localhost:3000";

const agendaGrid = document.getElementById("agendaGrid");
const emptyState = document.getElementById("emptyState");
const messageBox = document.getElementById("messageBox");
const searchAgenda = document.getElementById("searchAgenda");
const clearAgendaBtn = document.getElementById("clearAgendaBtn");
const sidebarGuideEmail = document.getElementById("sidebarGuideEmail");

const metricAgendaTotal = document.getElementById("metricAgendaTotal");
const metricHoje = document.getElementById("metricHoje");
const metricComData = document.getElementById("metricComData");
const metricSemData = document.getElementById("metricSemData");

let allAgendaItems = [];
let filteredAgendaItems = [];

function getStoredUser() {
  const raw = localStorage.getItem("usuario");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return JSON.parse(parsed);
    return parsed;
  } catch {
    return null;
  }
}

function showMessage(type, text) {
  messageBox.className = `message-box ${type}`;
  messageBox.textContent = text;
}

function clearMessage() {
  messageBox.className = "message-box hidden";
  messageBox.textContent = "";
}

function normalizeHorarios(horarios) {
  if (!horarios) return [];

  if (Array.isArray(horarios)) return horarios;

  try {
    const parsed = JSON.parse(horarios);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "Sem data";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("pt-BR");
}

function updateMetrics(data) {
  metricAgendaTotal.textContent = data.length;

  const hoje = new Date().toISOString().slice(0, 10);
  const comData = data.filter(item => item.data_passeio).length;
  const semData = data.filter(item => !item.data_passeio).length;
  const hojeCount = data.filter(item => item.data_passeio === hoje).length;

  metricHoje.textContent = hojeCount;
  metricComData.textContent = comData;
  metricSemData.textContent = semData;
}

function renderAgenda(data) {
  agendaGrid.innerHTML = "";

  if (!data.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  data.forEach((item) => {
    const horarios = normalizeHorarios(item.horarios);
    const card = document.createElement("article");
    card.className = "agenda-card";

    card.innerHTML = `
      <h3>${item.local || "Passeio sem nome"}</h3>
      <p class="agenda-location">${item.cidade || "--"} / ${item.estado || "--"}</p>

      <div class="agenda-meta">
        <div class="meta-box">
          <span>Data</span>
          <strong>${formatDate(item.data_passeio)}</strong>
        </div>

        <div class="meta-box">
          <span>Frequência</span>
          <strong>${item.frequencia || "Não informada"}</strong>
        </div>

        <div class="meta-box">
          <span>Horários</span>
          <strong>${horarios.length ? horarios.join(", ") : "Não informados"}</strong>
        </div>

        <div class="meta-box">
          <span>Classificação</span>
          <strong>${item.classificacao || "Não informada"}</strong>
        </div>
      </div>
    `;

    agendaGrid.appendChild(card);
  });
}

function applyFilters() {
  const search = searchAgenda.value.trim().toLowerCase();

  filteredAgendaItems = allAgendaItems.filter((item) => {
    const horarios = normalizeHorarios(item.horarios).join(" ");
    const searchBase = [
      item.local || "",
      item.cidade || "",
      item.estado || "",
      item.frequencia || "",
      item.classificacao || "",
      horarios
    ].join(" ").toLowerCase();

    return !search || searchBase.includes(search);
  });

  updateMetrics(filteredAgendaItems);
  renderAgenda(filteredAgendaItems);
}

function clearFilters() {
  searchAgenda.value = "";
  applyFilters();
}

async function loadAgenda() {
  clearMessage();

  const user = getStoredUser();

  if (!user) {
    window.location.href = "/paginas/login1.html";
    return;
  }

  sidebarGuideEmail.textContent = user.email || "--";

  try {
    const response = await fetch(`${API_BASE_URL}/guias/${user.id}/passeios`);

    if (!response.ok) {
      throw new Error("Não foi possível carregar a agenda do guia.");
    }

    const data = await response.json();
    allAgendaItems = Array.isArray(data) ? data : [];
    filteredAgendaItems = [...allAgendaItems];

    updateMetrics(filteredAgendaItems);
    renderAgenda(filteredAgendaItems);
  } catch (error) {
    showMessage("error", error.message);
  }
}

searchAgenda.addEventListener("input", applyFilters);
clearAgendaBtn.addEventListener("click", clearFilters);

window.addEventListener("DOMContentLoaded", loadAgenda);