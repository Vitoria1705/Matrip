const API_BASE_URL = "http://localhost:3000";

const metricPasseios = document.getElementById("metricPasseios");
const metricServicos = document.getElementById("metricServicos");
const metricAgenda = document.getElementById("metricAgenda");
const metricAvaliacao = document.getElementById("metricAvaliacao");

const summaryGuideName = document.getElementById("summaryGuideName");
const summaryGuideEmail = document.getElementById("summaryGuideEmail");
const summaryGuideType = document.getElementById("summaryGuideType");
const summaryGuideUserId = document.getElementById("summaryGuideUserId");
const sidebarGuideEmail = document.getElementById("sidebarGuideEmail");

const updatesList = document.getElementById("updatesList");
const nextTripsList = document.getElementById("nextTripsList");
const summaryTableBody = document.getElementById("summaryTableBody");

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

function formatCurrency(value) {
  const number = Number(value || 0);
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function fillUserSummary(user) {
  summaryGuideName.textContent = user?.nome || "--";
  summaryGuideEmail.textContent = user?.email || "--";
  summaryGuideType.textContent = user?.tipo || "--";
  summaryGuideUserId.textContent = user?.id || "--";
  sidebarGuideEmail.textContent = user?.email || "--";
}

function renderUpdates(passeios) {
  updatesList.innerHTML = "";

  if (!passeios.length) {
    updatesList.innerHTML = "<li>Nenhuma atualização recente encontrada.</li>";
    return;
  }

  const items = passeios.slice(0, 4).map((passeio) => {
    return `<li>Passeio “${passeio.local || "Sem nome"}” disponível em ${passeio.cidade || "--"}.</li>`;
  });

  updatesList.innerHTML = items.join("");
}

function renderNextTrips(passeios) {
  nextTripsList.innerHTML = "";

  if (!passeios.length) {
    nextTripsList.innerHTML = `<div class="mini-list-empty">Nenhum passeio encontrado.</div>`;
    return;
  }

  passeios.slice(0, 4).forEach((passeio) => {
    const item = document.createElement("div");
    item.className = "trip-item";
    item.innerHTML = `
      <strong>${passeio.local || "Passeio sem nome"}</strong>
      <span>${passeio.cidade || "--"} / ${passeio.estado || "--"}</span>
      <span>Valor final: ${formatCurrency(passeio.valor_final)}</span>
      <span>ID: #${passeio.id}</span>
    `;
    nextTripsList.appendChild(item);
  });
}

function renderSummaryTable(passeios) {
  summaryTableBody.innerHTML = "";

  if (!passeios.length) {
    summaryTableBody.innerHTML = `
      <tr>
        <td colspan="4">Nenhum passeio vinculado ao guia.</td>
      </tr>
    `;
    return;
  }

  passeios.slice(0, 6).forEach((passeio) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${passeio.local || "--"}</td>
      <td>${passeio.cidade || "--"} / ${passeio.estado || "--"}</td>
      <td>${formatCurrency(passeio.valor_final)}</td>
      <td>#${passeio.id}</td>
    `;
    summaryTableBody.appendChild(tr);
  });
}

async function loadGuideDashboard() {
  const user = getStoredUser();

  if (!user) {
    window.location.href = "/paginas/login1.html";
    return;
  }

  fillUserSummary(user);

  try {
    const response = await fetch(`${API_BASE_URL}/guias/${user.id}/passeios`);

    if (!response.ok) {
      throw new Error("Não foi possível carregar os passeios do guia.");
    }

    const passeios = await response.json();
    const lista = Array.isArray(passeios) ? passeios : [];

    metricPasseios.textContent = lista.length;
    metricServicos.textContent = "0";
    metricAgenda.textContent = lista.length;
    metricAvaliacao.textContent = "5,0";

    renderUpdates(lista);
    renderNextTrips(lista);
    renderSummaryTable(lista);
  } catch (error) {
    metricPasseios.textContent = "0";
    metricServicos.textContent = "0";
    metricAgenda.textContent = "0";
    metricAvaliacao.textContent = "0,0";

    updatesList.innerHTML = `<li>${error.message}</li>`;
    nextTripsList.innerHTML = `<div class="mini-list-empty">${error.message}</div>`;
    summaryTableBody.innerHTML = `
      <tr>
        <td colspan="4">${error.message}</td>
      </tr>
    `;
  }
}

window.addEventListener("DOMContentLoaded", loadGuideDashboard);