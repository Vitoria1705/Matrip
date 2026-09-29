const API_BASE_URL = "";

// Elementos da Interface
const emptyState = document.getElementById("emptyState");
const messageBox = document.getElementById("messageBox");

// Filtros e Métricas
const searchPasseio = document.getElementById("searchPasseio");
const metricTotal = document.getElementById("metricTotal");
const metricPrecoMedio = document.getElementById("metricPrecoMedio");

let allPasseios = [];
let filteredPasseios = [];

// --- FUNÇÕES DE AUXÍLIO ---

function showMessage(type, text) {
  if (!messageBox) return;
  messageBox.className = `message-box ${type}`;
  messageBox.textContent = text;
  setTimeout(() => messageBox.className = "message-box hidden", 5000);
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function buildImageUrl(imageName) {
  if (!imageName) return "../../logo-matrip-oficial-01.png";
  if (imageName.startsWith("http")) return imageName;
  return `${API_BASE_URL}/uploads/${imageName.replace('/uploads/', '')}`;
}

// --- LÓGICA DE DADOS ---

function updateMetrics(data) {
  if (!metricTotal) return;
  metricTotal.textContent = data.length;
  const totalValores = data.reduce((acc, p) => acc + Number(p.valor_final || 0), 0);
  const media = data.length ? totalValores / data.length : 0;
  if (metricPrecoMedio) metricPrecoMedio.textContent = formatCurrency(media);
}

function renderPasseios(data) {
  const listContainer = document.getElementById("passeiosList");
  listContainer.innerHTML = "";

  if (!data.length) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  data.forEach(p => {
    const temServicos = p.servicos && p.servicos.length > 0;

    const item = document.createElement("div");
    item.className = "list-item";
    item.id = `passeio-${p.id}`;

    item.innerHTML = `
      <div class="list-item-header" onclick="togglePasseio(${p.id})">
        <img src="${buildImageUrl(p.imagem)}" class="mini-thumb" onerror="this.src='../../logo-matrip-oficial-01.png'">
        <div>
          <h4>${p.local}</h4>
          <small>${p.categoria || 'Geral'}</small>
        </div>
        <span class="location-tag">
            <span class="material-symbols-outlined location-icon">location_on</span>
            ${p.cidade || '--'} 
        </span>
        <strong style="color: #11c5b6">${formatCurrency(p.valor_final)}</strong>
        <span class="arrow-icon">▼</span>
      </div>

      <div class="list-item-details">
        <div class="details-grid" style="display: flex; gap: 25px; margin-bottom: 20px;">
          <div style="flex: 1;">
            <img src="${buildImageUrl(p.imagem)}" class="details-img-large" style="width:100%; height:220px; object-fit:cover; border-radius:12px;" onerror="this.src='../../logo-matrip-oficial-01.png'">
          </div>

          <div style="flex: 1.8;">
            <h3>Detalhes do Produto #${p.id}</h3>
            <p><strong>Descrição:</strong> ${p.descricao || 'Sem descrição.'}</p>
            <p><strong>Estado:</strong> ${p.estado || '--'}</p>
            
            <div style="margin-top: 30px; display: flex; align-items: center; gap: 10px;">
              
              <button class="primary-btn" style="height: 40px; padding: 0 20px; display: flex; align-items: center; font-size: 14px;" onclick="window.location.href='../detalhes.html?id=${p.id}'">
                Ver no Site
              </button>
              
              <button class="btn-action" onclick="bloquearPasseioAdmin(${p.id})" title="Bloquear" 
                style="height: 40px; width: 40px; background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span class="material-symbols-outlined" style="font-size: 22px;">block</span>
              </button>

              <button class="btn-action" onclick="toggleServicos(${p.id})" title="Ver Serviços" 
                style="height: 40px; width: 40px; background: #f1f5f9; color: #023847; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span class="material-symbols-outlined" style="font-size: 22px;">dry_cleaning</span>
              </button>

              <button class="btn-action" onclick="window.location.href='editar-produto.html?id=${p.id}'" title="Editar Passeio" 
                style="height: 40px; width: 40px; background: #11c5b6; color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                  <span class="material-symbols-outlined" style="font-size: 22px;">edit</span>
              </button>

            </div>
          </div>
        </div>

        <div id="box-servicos-${p.id}" class="servicos-expansivel" style="width: 100%; display: none; margin-top: 10px;">
            <h4 style="margin-top:0;">Serviços Disponíveis para este Passeio</h4>
            <div class="lista-interna">
                ${temServicos ? `
                    <ul class="lista-servicos-mini" style="margin:0; padding:0; list-style:none;">
                        ${p.servicos.map(s => `<li style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px dashed #ddd;"><span>${s.nome}</span> <strong>${formatCurrency(s.valor)}</strong></li>`).join('')}
                    </ul>
                ` : `
                    <p style="text-align: center; color: #94a3b8; margin: 15px 0;">Nenhum serviço encontrado para este produto.</p>
                `}
            </div>
        </div>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

function toggleServicos(id) {
    const box = document.getElementById(`box-servicos-${id}`);
    box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
}

function togglePasseio(id) {
  const el = document.getElementById(`passeio-${id}`);
  const isOpen = el.classList.contains('active');
  document.querySelectorAll('.list-item').forEach(item => {
    item.classList.remove('active');
    const icon = item.querySelector('.arrow-icon');
    if(icon) icon.textContent = '▼';
  });
  if (!isOpen) {
    el.classList.add('active');
    el.querySelector('.arrow-icon').textContent = '▲';
  }
}

function applyFilters() {
  const search = (document.getElementById("searchPasseio")?.value || "").toLowerCase().trim();
  const cidade = (document.getElementById("filterCidade")?.value || "").toLowerCase().trim();

  filteredPasseios = allPasseios.filter(p => {
    const matchesSearch = !search || (p.local || "").toLowerCase().includes(search) || (p.descricao || "").toLowerCase().includes(search);
    const matchesCidade = !cidade || (p.cidade || "").toLowerCase().includes(cidade);
    return matchesSearch && matchesCidade;
  });

  renderPasseios(filteredPasseios);
}

async function loadPasseios() {
  try {
    const response = await fetch(`${API_BASE_URL}/passeios`);
    allPasseios = await response.json();
    renderPasseios(allPasseios);
    updateMetrics(allPasseios);
  } catch (error) {
    showMessage("error", "Erro ao carregar dados.");
  }
}

async function bloquearPasseioAdmin(id) {
    if (!confirm(`ADMIN: Deseja realmente BLOQUEAR o produto #${id}?`)) return;
    alert('Funcionalidade de bloqueio integrada.');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("btnSearch")?.addEventListener("click", applyFilters);
  
  // Registrar botão Limpar Filtros
  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    const searchInput = document.getElementById("searchPasseio");
    if (searchInput) searchInput.value = "";
    
    const filterCidade = document.getElementById("filterCidade");
    if (filterCidade) filterCidade.value = "";

    const filterAgencia = document.getElementById("filterAgencia");
    if (filterAgencia) filterAgencia.value = "";

    applyFilters();
  });

  // Permitir busca ao pressionar Enter nos inputs
  document.getElementById("searchPasseio")?.addEventListener("keyup", (e) => {
    if (e.key === 'Enter') applyFilters();
  });
  document.getElementById("filterCidade")?.addEventListener("keyup", (e) => {
    if (e.key === 'Enter') applyFilters();
  });

  loadPasseios();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario?.email) document.getElementById('adminEmail').textContent = usuario.email;
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '../../index.html';
  });
});