const API_BASE_URL = "http://localhost:3000";

const passeiosGrid = document.getElementById("passeiosGrid");
const emptyState = document.getElementById("emptyState");
const messageBox = document.getElementById("messageBox");

const filterCidade = document.getElementById("filterCidade");
const filterCategoria = document.getElementById("filterCategoria");
const searchPasseio = document.getElementById("searchPasseio");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const metricTotal = document.getElementById("metricTotal");
const metricCidades = document.getElementById("metricCidades");
const metricPrecoMedio = document.getElementById("metricPrecoMedio");
const metricCategorias = document.getElementById("metricCategorias");
const sidebarGuideEmail = document.getElementById("sidebarGuideEmail");

let allPasseios = [];
let filteredPasseios = [];

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

function formatCurrency(value) {
  const number = Number(value || 0);
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function buildImageUrl(imageName) {
  if (!imageName) return "../../logo-matrip-oficial-01.png";

  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }

  if (imageName.startsWith("/uploads/")) {
    return `${API_BASE_URL}${imageName}`;
  }

  return `${API_BASE_URL}/uploads/${imageName}`;
}

function truncateText(text, maxLength = 130) {
  if (!text) return "Sem descrição disponível.";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function updateMetrics(data) {
  metricTotal.textContent = data.length;

  const cidades = new Set(
    data.map(item => (item.cidade || "").trim().toLowerCase()).filter(Boolean)
  );

  const categorias = new Set(
    data.map(item => (item.categoria || "").trim().toLowerCase()).filter(Boolean)
  );

  const totalPrecos = data.reduce((acc, item) => acc + Number(item.valor_final || 0), 0);
  const precoMedio = data.length ? totalPrecos / data.length : 0;

  metricCidades.textContent = cidades.size;
  metricCategorias.textContent = categorias.size;
  metricPrecoMedio.textContent = formatCurrency(precoMedio);
}

function renderPasseios(data) {
  passeiosGrid.innerHTML = "";

  if (!data.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  data.forEach((passeio) => {
    const imageUrl = buildImageUrl(passeio.imagem || "");

    const card = document.createElement("article");
    card.className = "passeio-card";

    card.innerHTML = `
      <img
        src="${imageUrl}"
        alt="${passeio.local || "Passeio"}"
        class="passeio-image"
        onerror="this.src='../../logo-matrip-oficial-01.png'"
      />

      <div class="passeio-body">
        <div class="passeio-top">
          <h2 class="passeio-title">${passeio.local || "Passeio sem nome"}</h2>
          <span class="passeio-category">${passeio.categoria || "Sem categoria"}</span>
        </div>

        <p class="passeio-location">${passeio.cidade || "--"} / ${passeio.estado || "--"}</p>

        <p class="passeio-description">${truncateText(passeio.descricao)}</p>

        <div class="passeio-meta">
          <div class="meta-item">
            <span>Preço final</span>
            <strong>${formatCurrency(passeio.valor_final)}</strong>
          </div>

          <div class="meta-item">
            <span>ID do passeio</span>
            <strong>#${passeio.id}</strong>
          </div>
        </div>

        <div class="passeio-actions">
          <button class="card-btn secondary" type="button" data-action="details" data-id="${passeio.id}">
            Ver detalhes
          </button>
        </div>
      </div>
    `;

    passeiosGrid.appendChild(card);
  });
}

function applyFilters() {
  const cidade = filterCidade.value.trim().toLowerCase();
  const categoria = filterCategoria.value.trim().toLowerCase();
  const search = searchPasseio.value.trim().toLowerCase();

  filteredPasseios = allPasseios.filter((passeio) => {
    const cidadeMatch = !cidade || (passeio.cidade || "").toLowerCase().includes(cidade);
    const categoriaMatch = !categoria || (passeio.categoria || "").toLowerCase().includes(categoria);

    const searchBase = [
      passeio.local || "",
      passeio.descricao || "",
      passeio.cidade || "",
      passeio.categoria || ""
    ].join(" ").toLowerCase();

    const searchMatch = !search || searchBase.includes(search);

    return cidadeMatch && categoriaMatch && searchMatch;
  });

  updateMetrics(filteredPasseios);
  renderPasseios(filteredPasseios);
}

function clearFilters() {
  filterCidade.value = "";
  filterCategoria.value = "";
  searchPasseio.value = "";
  applyFilters();
}

async function loadPasseiosDoGuia() {
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
      throw new Error("Não foi possível carregar os passeios do guia.");
    }

    const data = await response.json();
    allPasseios = Array.isArray(data) ? data : [];
    filteredPasseios = [...allPasseios];

    updateMetrics(filteredPasseios);
    renderPasseios(filteredPasseios);
  } catch (error) {
    showMessage("error", error.message);
  }
}

filterCidade.addEventListener("input", applyFilters);
filterCategoria.addEventListener("input", applyFilters);
searchPasseio.addEventListener("input", applyFilters);
clearFiltersBtn.addEventListener("click", clearFilters);

passeiosGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const passeioId = button.dataset.id;

  if (action === "details") {
    window.location.href = `../../paginas/Detalhes.html?id=${passeioId}`;
  }
});

window.addEventListener("DOMContentLoaded", loadPasseiosDoGuia);