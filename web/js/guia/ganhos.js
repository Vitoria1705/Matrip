const API_BASE_URL = "http://localhost:3000";

const metricTotalGanhos = document.getElementById("metricTotalGanhos");
const metricMediaGanhos = document.getElementById("metricMediaGanhos");
const metricMaiorGanhos = document.getElementById("metricMaiorGanhos");
const metricQtdGanhos = document.getElementById("metricQtdGanhos");
const ganhosList = document.getElementById("ganhosList");
const sidebarGuideEmail = document.getElementById("sidebarGuideEmail");

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

function renderGanhos(passeios) {
  ganhosList.innerHTML = "";

  if (!passeios.length) {
    ganhosList.innerHTML = `<div class="ganho-item"><div class="ganho-item__info"><strong>Nenhum dado disponível</strong><span>Não há passeios para compor a estimativa.</span></div><div class="ganho-item__value">R$ 0,00</div></div>`;
    return;
  }

  passeios.forEach((passeio) => {
    const item = document.createElement("div");
    item.className = "ganho-item";
    item.innerHTML = `
      <div class="ganho-item__info">
        <strong>${passeio.local || "Passeio sem nome"}</strong>
        <span>${passeio.cidade || "--"} / ${passeio.estado || "--"} · ID #${passeio.id}</span>
      </div>
      <div class="ganho-item__value">${formatCurrency(passeio.valor_final)}</div>
    `;
    ganhosList.appendChild(item);
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  const user = getStoredUser();

  if (!user) {
    window.location.href = "/paginas/login1.html";
    return;
  }

  sidebarGuideEmail.textContent = user.email || "--";

  try {
    const response = await fetch(`${API_BASE_URL}/guias/${user.id}/passeios`);
    if (!response.ok) {
      throw new Error("Não foi possível carregar a estimativa de ganhos.");
    }

    const passeios = await response.json();
    const lista = Array.isArray(passeios) ? passeios : [];
    const valores = lista.map(item => Number(item.valor_final || 0));
    const total = valores.reduce((acc, value) => acc + value, 0);
    const media = lista.length ? total / lista.length : 0;
    const maior = lista.length ? Math.max(...valores) : 0;

    metricTotalGanhos.textContent = formatCurrency(total);
    metricMediaGanhos.textContent = formatCurrency(media);
    metricMaiorGanhos.textContent = formatCurrency(maior);
    metricQtdGanhos.textContent = lista.length;

    renderGanhos(lista);
  } catch (error) {
    metricTotalGanhos.textContent = "R$ 0,00";
    metricMediaGanhos.textContent = "R$ 0,00";
    metricMaiorGanhos.textContent = "R$ 0,00";
    metricQtdGanhos.textContent = "0";
    ganhosList.innerHTML = `<div class="ganho-item"><div class="ganho-item__info"><strong>Erro ao carregar</strong><span>${error.message}</span></div><div class="ganho-item__value">--</div></div>`;
  }
});