var API_BASE = API_BASE || "";

if (window.debugLog) window.debugLog("Lendo arquivo gerenciar-usuarios.js...");

function inicializarGerenciarUsuarios() {
    if (window.debugLog) window.debugLog("inicializarGerenciarUsuarios iniciada");
    console.log("=== Executando inicializarGerenciarUsuarios() ===");
    
    const usersTableBody = document.getElementById('usersTableBody');
    const searchUserInput = document.getElementById('searchUser');
    const btnSearch = document.getElementById('btnSearch');
    const formCadastrarUsuario = document.getElementById('formCadastrarUsuario');
    
    console.log("Elementos HTML encontrados:", {
        usersTableBody: !!usersTableBody,
        searchUserInput: !!searchUserInput,
        btnSearch: !!btnSearch,
        formCadastrarUsuario: !!formCadastrarUsuario
    });

    let allUsers = [];

    // Função para buscar e renderizar usuários
    async function carregarUsuarios() {
        if (window.debugLog) window.debugLog("carregarUsuarios() chamada");
        try {
            if (window.debugLog) window.debugLog("Efetuando fetch para " + API_BASE + "/usuarios");
            const res = await fetch(`${API_BASE}/usuarios`);
            if (window.debugLog) window.debugLog("Fetch concluído. Status: " + res.status);
            if (!res.ok) throw new Error("Erro ao buscar usuários (HTTP " + res.status + ")");
            allUsers = await res.json();
            if (window.debugLog) window.debugLog("Usuários decodificados: " + allUsers.length);
            renderizarTabela(allUsers);
            atualizarCards(allUsers);
        } catch (error) {
            if (window.debugLog) window.debugLog("CATCH carregarUsuarios: " + error.message);
            console.error("Erro ao carregar usuários:", error);
            if (usersTableBody) {
                usersTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Erro ao carregar lista de usuários: ${error.message}</td></tr>`;
            }
        }
    }

    // Função para renderizar as linhas da tabela
    function renderizarTabela(users) {
        if (!usersTableBody) {
            console.warn("Elemento usersTableBody não existe na página.");
            return;
        }
        usersTableBody.innerHTML = '';
        if (users.length === 0) {
            usersTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Nenhum usuário encontrado.</td></tr>`;
            return;
        }

        users.forEach(user => {
            const tr = document.createElement('tr');
            
            // Formatando o tipo
            let tipoFormatado = 'Cliente';
            if (user.tipo === 'guia') tipoFormatado = 'Guia';
            if (user.tipo === 'admin') tipoFormatado = 'Admin';

            tr.innerHTML = `
                <td><strong>${user.nome}</strong></td>
                <td>${user.email}<br><small>Tipo: ${tipoFormatado}</small></td>
                <td>--</td>
                <td><span class="status-badge ativo">Ativo</span></td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end; gap: 8px;">
                        <select class="role-select" data-id="${user.id}" style="padding: 6px 10px; border-radius: 8px; border: 1px solid #ccc; font-size: 13px; background: white; outline: none; cursor: pointer;">
                            <option value="usuario" ${user.tipo === 'usuario' ? 'selected' : ''}>Usuário</option>
                            <option value="guia" ${user.tipo === 'guia' ? 'selected' : ''}>Guia</option>
                            <option value="admin" ${user.tipo === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                </td>
            `;

            // Adiciona evento de alteração de tipo
            const select = tr.querySelector('.role-select');
            select.addEventListener('change', async (e) => {
                const novoTipo = e.target.value;
                const userId = e.target.getAttribute('data-id');
                if (confirm(`Deseja realmente alterar o tipo deste usuário para ${novoTipo}?`)) {
                    await alterarTipoUsuario(userId, novoTipo);
                } else {
                    // Reverte para o tipo anterior
                    e.target.value = user.tipo;
                }
            });

            usersTableBody.appendChild(tr);
        });
        console.log("Tabela renderizada com sucesso com", users.length, "usuários.");
    }

    // Atualiza os painéis informativos superiores
    function atualizarCards(users) {
        const cards = document.querySelectorAll('.info-card .card-number');
        if (cards.length >= 4) {
            cards[0].textContent = users.length; // Total
            cards[1].textContent = users.filter(u => u.tipo === 'guia').length; // Usando Guias no lugar de novos no mês
            cards[2].textContent = users.filter(u => u.tipo === 'usuario').length; // Clientes no lugar de ativos agora
            cards[3].textContent = "0"; // Bloqueados (não mapeado no banco)
            
            // Atualiza os textos pequenos
            const spans = document.querySelectorAll('.info-card span');
            if (spans.length >= 3) {
                spans[1].textContent = "guias cadastrados";
                spans[2].textContent = "clientes cadastrados";
            }
        }
    }

    // Função para alterar tipo de usuário na API
    async function alterarTipoUsuario(id, tipo) {
        try {
            const res = await fetch(`${API_BASE}/admin/usuarios/${id}/tipo`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipo })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Erro ao atualizar tipo");
            }

            alert("Tipo do usuário atualizado com sucesso!");
            carregarUsuarios();
        } catch (error) {
            alert("Erro: " + error.message);
            carregarUsuarios();
        }
    }

    // Evento de busca de usuário
    function fazerBusca() {
        if (!searchUserInput) return;
        const query = searchUserInput.value.toLowerCase().trim();
        if (!query) {
            renderizarTabela(allUsers);
            return;
        }

        const filtrados = allUsers.filter(u => 
            (u.nome && u.nome.toLowerCase().includes(query)) ||
            (u.email && u.email.toLowerCase().includes(query))
        );
        renderizarTabela(filtrados);
    }

    if (btnSearch) btnSearch.addEventListener('click', fazerBusca);
    if (searchUserInput) {
        searchUserInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') fazerBusca();
        });
    }

    // Cadastro de novo usuário
    if (formCadastrarUsuario) {
        formCadastrarUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('userName').value;
            const email = document.getElementById('userEmail').value;
            const senha = document.getElementById('userPass').value;
            const confirmarSenha = document.getElementById('userConfirmPass').value;

            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Erro ao cadastrar usuário");
                }

                alert("Usuário cadastrado com sucesso!");
                formCadastrarUsuario.reset();
                if (window.toggleFormulario) {
                    window.toggleFormulario('formUsuario');
                } else {
                    document.getElementById('formUsuario').style.display = 'none';
                }
                carregarUsuarios();
            } catch (error) {
                alert("Erro ao cadastrar: " + error.message);
            }
        });
    }

    // Inicialização
    carregarUsuarios();
}

// Expor globalmente para depuração
window.inicializarGerenciarUsuarios = inicializarGerenciarUsuarios;

// Padrão seguro de carregamento do DOM
if (document.readyState === "loading") {
    console.log("DOM ainda carregando. Adicionando listener...");
    document.addEventListener("DOMContentLoaded", inicializarGerenciarUsuarios);
} else {
    console.log("DOM já carregado. Inicializando imediatamente...");
    inicializarGerenciarUsuarios();
}
