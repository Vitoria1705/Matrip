var API_BASE = API_BASE || "";

let allAgencias = [];
let filteredAgencias = [];

// 1. ATUALIZA AS MÉTRICAS DO TOPO
function updateMetrics() {
  const metricTotal = document.getElementById("metricTotal");
  const metricPendentes = document.getElementById("metricPendentes");
  const metricAtivas = document.getElementById("metricAtivas");

  if (metricTotal) metricTotal.textContent = filteredAgencias.length;
  if (metricPendentes) {
    // Como no banco temos 'ativa' e 'inativa', consideramos as 'inativa' como inativas/bloqueadas
    metricPendentes.textContent = filteredAgencias.filter(a => a.status === 'inativa').length;
  }
  if (metricAtivas) {
    metricAtivas.textContent = filteredAgencias.filter(a => a.status === 'ativa').length;
  }
}

// 2. RENDERIZA A LISTA SANFONA
function renderAgencias(data) {
  const listContainer = document.getElementById("agenciasList");
  const emptyState = document.getElementById("emptyState");
  if (!listContainer) return;
  
  listContainer.innerHTML = "";

  if (!data || data.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if (emptyState) emptyState.classList.add("hidden");

  data.forEach((ag, index) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.id = `agencia-${index}`;

    // Mapeamento visual para status
    let statusText = ag.status === 'ativa' ? 'ATIVA' : 'INATIVA';
    let badgeClass = ag.status === 'ativa' ? 'ativo' : 'bloqueado';

    let botoesAcao = ag.status === 'inativa' ? `
        <button class="btn-action btn-unblock" onclick="alterarStatus(${ag.id}, 'ativa')" title="Ativar">
          <span class="material-symbols-outlined">check_circle</span> Ativar Agência
        </button>
      ` : `
        <button class="btn-action btn-block" onclick="alterarStatus(${ag.id}, 'inativa')">
          <span class="material-symbols-outlined">block</span> Bloquear Acesso
        </button>
      `;

    item.innerHTML = `
      <div class="list-item-header" style="display: flex; align-items: center; padding: 15px 20px; cursor: pointer; gap: 10px;">
        
        <div style="display: flex; align-items: center; gap: 15px; flex: 2.5;" onclick="toggleAgencia(${index})">
          <span class="material-symbols-outlined" style="color: #94a3b8; font-size: 28px;">domain</span>
          <div>
            <h4 style="margin: 0; color: #023847;">${ag.nome_fantasia || ag.nomeFantasia}</h4>
            <small style="color: #64748b;">CNPJ: ${ag.cnpj}</small>
          </div>
        </div>

        <div style="flex: 2; color: #475569;" onclick="toggleAgencia(${index})">
          <span style="display:block; font-size: 14px; font-weight: 500;">${ag.email}</span>
          <small style="color: #94a3b8;">${ag.celular || ag.telefone || 'Sem telefone'}</small>
        </div>

        <div style="flex: 1.2; display: flex; justify-content: flex-start;" onclick="toggleAgencia(${index})">
          <span class="status-badge ${badgeClass}" style="white-space: nowrap; min-width: 100px; text-align: center;">
            ${statusText}
          </span>
        </div>

        <div style="flex: 0.8; display: flex; align-items: center; justify-content: flex-end; gap: 25px;">
          <button class="btn-action" onclick="event.stopPropagation(); abrirGestaoGuias('${ag.cnpj}', '${ag.nome_fantasia || ag.nomeFantasia}')" 
                  title="Gerenciar Guias" 
                  style="background: rgba(2, 56, 71, 0.08); color: #023847; border: none; padding: 10px; border-radius: 8px; cursor: pointer; display: flex; align-items: center;">
            <span class="material-symbols-outlined" style="font-size: 22px;">explore</span>
          </button>
          
          <span class="material-symbols-outlined arrow-icon" onclick="toggleAgencia(${index})" style="color: #cbd5e1; user-select: none;">expand_more</span>
        </div>
      </div>

      <div class="list-item-details">
        <div class="agency-details-grid">
          <div class="info-block">
            <h4>Dados da Empresa</h4>
            <p><strong>Razão Social:</strong> ${ag.razao_social || ag.razaoSocial}</p>
            <p><strong>CNPJ:</strong> ${ag.cnpj}</p>
            <p><strong>Endereço:</strong> ${ag.endereco}, ${ag.bairro}</p>
          </div>
          <div class="info-block">
            <h4>Contato Principal</h4>
            <p><strong>E-mail:</strong> ${ag.email}</p>
            <p><strong>Celular:</strong> ${ag.celular}</p>
            <p><strong>Telefone Fixo:</strong> ${ag.telefone || 'Não informado'}</p>
          </div>
        </div>
        <div class="action-bar" style="display: flex; gap: 10px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
          ${botoesAcao}
        </div>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

function toggleAgencia(index) {
  const el = document.getElementById(`agencia-${index}`);
  const isOpen = el.classList.contains('active');
  
  document.querySelectorAll('.list-item').forEach(item => {
    item.classList.remove('active');
    const icon = item.querySelector('.arrow-icon');
    if(icon) icon.textContent = 'expand_more';
  });

  if (!isOpen) {
    el.classList.add('active');
    el.querySelector('.arrow-icon').textContent = 'expand_less';
  }
}

// REDIRECIONAMENTO PARA A PÁGINA "AGENCIA-GUIAS"
function abrirGestaoGuias(cnpj, nome) {
    const nomeEncoded = encodeURIComponent(nome);
    const cnpjEncoded = encodeURIComponent(cnpj);
    window.location.href = `agencia-guias.html?cnpj=${cnpjEncoded}&nome=${nomeEncoded}`;
}

// ALTERAR STATUS DA AGÊNCIA NO BANCO VIA API
async function alterarStatus(id, novoStatus) {
  const agencia = allAgencias.find(a => a.id === id);
  if (!agencia) return;

  if (confirm(`Deseja alterar o status da agência para ${novoStatus.toUpperCase()}?`)) {
      try {
          const payload = {
              nome_fantasia: agencia.nome_fantasia || agencia.nomeFantasia,
              razao_social: agencia.razao_social || agencia.razaoSocial,
              cnpj: agencia.cnpj,
              email: agencia.email,
              homepage: agencia.homepage,
              endereco: agencia.endereco,
              bairro: agencia.bairro,
              telefone: agencia.telefone,
              celular: agencia.celular,
              status: novoStatus,
              logo: agencia.logo
          };

          const res = await fetch(`${API_BASE}/api/agencias/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (!res.ok) {
              const err = await res.json();
              throw new Error(err.message || "Erro ao atualizar status");
          }

          alert("Status atualizado com sucesso!");
          await fetchAgencias();
      } catch (error) {
          alert("Erro ao alterar status: " + error.message);
      }
  }
}

function applyFilters() {
  const statusFilter = document.getElementById("filterStatus")?.value.toLowerCase().trim();
  const searchFilter = document.getElementById("searchAgencia")?.value.toLowerCase().trim();

  filteredAgencias = allAgencias.filter(a => {
    // Mapeia filtro para bater com o banco (ativa / inativa)
    let dbStatus = a.status;
    let matchStatus = true;
    if (statusFilter === 'ativo') {
      matchStatus = dbStatus === 'ativa';
    } else if (statusFilter === 'bloqueado') {
      matchStatus = dbStatus === 'inativa';
    }

    const nome = (a.nome_fantasia || a.nomeFantasia || "").toLowerCase();
    const matchSearch = !searchFilter || nome.includes(searchFilter) || a.cnpj.includes(searchFilter);
    return matchStatus && matchSearch;
  });

  renderAgencias(filteredAgencias);
  updateMetrics();
}

async function fetchAgencias() {
  try {
    const res = await fetch(`${API_BASE}/agencias`);
    if (!res.ok) throw new Error("Erro ao buscar agências da API");
    allAgencias = await res.json();
    filteredAgencias = [...allAgencias];
    
    renderAgencias(allAgencias);
    updateMetrics();
  } catch (error) {
    console.error(error);
    const listContainer = document.getElementById("agenciasList");
    if (listContainer) {
      listContainer.innerHTML = `<p style="text-align: center; color: red; padding: 20px;">Erro ao carregar agências do banco de dados.</p>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("btnSearch")?.addEventListener("click", applyFilters);
  document.getElementById("searchAgencia")?.addEventListener("keypress", (e) => { if (e.key === "Enter") applyFilters(); });
  document.getElementById("filterStatus")?.addEventListener("change", applyFilters);
  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    document.getElementById("searchAgencia").value = "";
    document.getElementById("filterStatus").value = "";
    applyFilters();
  });

  fetchAgencias();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario && usuario.email) {
    const adminEmail = document.getElementById('adminEmail');
    if(adminEmail) adminEmail.textContent = usuario.email;
  }
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '../../index.html';
  });
}