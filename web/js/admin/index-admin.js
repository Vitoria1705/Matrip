var API_BASE = API_BASE || "";

function debugLog(msg) {
    console.log(msg);
    
    // Envia log para o terminal do Spring Boot
    fetch('/api/debug-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: window.location.pathname + " -> " + msg })
    }).catch(err => {});
}
window.debugLog = debugLog;

function toggleFormulario(id) {
    const form = document.getElementById(id);
    if (form) {
        form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
    }
}
window.toggleFormulario = toggleFormulario;

function inicializarIndexAdmin() {
    debugLog("inicializarIndexAdmin iniciada");
    
    // 1. BLINDAGEM DE SEGURANÇA
    let usuario;
    try {
        usuario = JSON.parse(localStorage.getItem('usuario'));
        debugLog("usuario carregado do localStorage: " + (usuario ? usuario.email : "null"));
    } catch (e) {
        debugLog("erro parse JSON usuario: " + e.message);
    }
    
    // Verifica se existe usuário e se ele é do tipo 'admin' (case-insensitive)
    if (!usuario || (usuario.tipo || "").toLowerCase() !== 'admin') {
        console.warn("Acesso negado: Usuário não autenticado ou sem permissão de admin.");
        window.location.href = '/paginas/login1.html';
        return;
    }

    // 2. INJEÇÃO DO E-MAIL REAL NA SIDEBAR
    const emailSidebar = document.getElementById('adminEmail');
    if (emailSidebar) {
        emailSidebar.textContent = usuario.email;
    }

    // 3. LÓGICA DO BOTÃO DE SAIR
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Deseja realmente sair do painel administrativo?")) {
                localStorage.removeItem('usuario');
                window.location.href = '../../index.html';
            }
        });
    }

    // 4. CARREGAR DADOS DINÂMICOS DA HOME DO ADMIN
    async function carregarDadosHome() {
        try {
            console.log("Buscando dados da home do admin no banco...");
            
            // Buscar Agências
            const resAgencias = await fetch(`${API_BASE}/agencias`);
            const agencias = resAgencias.ok ? await resAgencias.json() : [];

            // Buscar Usuários
            const resUsuarios = await fetch(`${API_BASE}/usuarios`);
            const usuarios = resUsuarios.ok ? await resUsuarios.json() : [];

            // Buscar Passeios
            const resPasseios = await fetch(`${API_BASE}/passeios`);
            const passeios = resPasseios.ok ? await resPasseios.json() : [];

            console.log("Dados carregados com sucesso. Atualizando interface...");

            // Atualizar Métricas na Tela
            const metricAgencias = document.getElementById('metricAgencias');
            const metricUsuarios = document.getElementById('metricUsuarios');
            const metricPasseios = document.getElementById('metricPasseios');
            const metricPendentes = document.getElementById('metricPendentes');

            if (metricAgencias) metricAgencias.textContent = agencias.length;
            if (metricUsuarios) metricUsuarios.textContent = usuarios.length;
            if (metricPasseios) metricPasseios.textContent = passeios.length;
            if (metricPendentes) {
                const pendentes = agencias.filter(a => a.status === 'inativa' || a.status === 'pendente').length;
                metricPendentes.textContent = pendentes;
            }

            // Alimentar Tabela de Agências em Destaque (Mostrar as 5 primeiras)
            const agenciasTableBody = document.getElementById('agenciasTableBody');
            if (agenciasTableBody) {
                agenciasTableBody.innerHTML = '';
                const destaque = agencias.slice(0, 5);

                if (destaque.length === 0) {
                    agenciasTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhuma agência cadastrada.</td></tr>`;
                    return;
                }

                destaque.forEach(ag => {
                    const tr = document.createElement('tr');
                    
                    let statusText = ag.status === 'ativa' ? 'Ativo' : 'Pendente';
                    let badgeClass = ag.status === 'ativa' ? 'ativo' : 'pendente';
                    let nomeAgencia = ag.nome_fantasia || ag.nomeFantasia || 'Agência';

                    tr.innerHTML = `
                        <td><strong>${nomeAgencia}</strong></td>
                        <td>${ag.cnpj || '--'}</td>
                        <td style="text-align: center;"><span class="status-badge ${badgeClass}">${statusText}</span></td>
                        <td style="text-align: right;">
                          <button class="btn-action btn-view" title="Ver Detalhes" onclick="window.location.href='gerenciar-agencias.html'"><span class="material-symbols-outlined">visibility</span></button>
                        </td>
                    `;
                    agenciasTableBody.appendChild(tr);
                });
            }

        } catch (error) {
            console.error("Erro ao carregar dados da home do admin:", error);
        }
    }

    // 5. CARREGAR DADOS DINÂMICOS DA PÁGINA CADASTROS.HTML
    async function carregarDadosCadastros() {
        try {
            console.log("Buscando resumo do inventário no banco...");
            
            // Buscar Idiomas
            const resIdiomas = await fetch(`${API_BASE}/api/admin/idiomas`);
            const idiomas = resIdiomas.ok ? await resIdiomas.json() : [];

            // Buscar Cidades
            const resCidades = await fetch(`${API_BASE}/api/localidades/cidades/1`);
            const cidades = resCidades.ok ? await resCidades.json() : [];

            // Buscar Categorias
            const resCategorias = await fetch(`${API_BASE}/categorias`);
            const categorias = resCategorias.ok ? await resCategorias.json() : [];

            // Buscar Agências
            const resAgencias = await fetch(`${API_BASE}/agencias`);
            const agencias = resAgencias.ok ? await resAgencias.json() : [];

            console.log("Dados de cadastros carregados com sucesso.");

            // Atualizar Métricas na Tela
            const statIdiomas = document.getElementById('statIdiomas');
            const statCidades = document.getElementById('statCidades');
            const statCategorias = document.getElementById('statCategorias');
            const statAgenciasPendentes = document.getElementById('statAgenciasPendentes');

            if (statIdiomas) statIdiomas.textContent = String(idiomas.length).padStart(2, '0');
            if (statCidades) statCidades.textContent = String(cidades.length).padStart(2, '0');
            if (statCategorias) statCategorias.textContent = String(categorias.length).padStart(2, '0');
            if (statAgenciasPendentes) {
                const pendentes = agencias.filter(a => a.status === 'inativa' || a.status === 'pendente').length;
                statAgenciasPendentes.textContent = String(pendentes).padStart(2, '0');
            }

        } catch (error) {
            console.error("Erro ao carregar resumo de cadastros:", error);
        }
    }

    // Executa a carga apenas se estiver na página index.html do admin
    const metricAgencias = document.getElementById('metricAgencias');
    if (metricAgencias) {
        carregarDadosHome();
    }

    // Executa a carga apenas se estiver na página cadastros.html do admin
    const statIdiomas = document.getElementById('statIdiomas');
    if (statIdiomas) {
        carregarDadosCadastros();
    }
}

// Padrão seguro de carregamento do DOM
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarIndexAdmin);
} else {
    inicializarIndexAdmin();
}
