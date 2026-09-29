// 1. Variáveis de controle no topo do arquivo
let modoEdicaoIdioma = false;
let idIdiomaEditando = null;

// 2. Carregar e Renderizar Idiomas da API
async function carregarTabelaIdiomas() {
    const tbody = document.getElementById('tabelaIdiomas');
    if (!tbody) return;

    try {
        const res = await fetch('/api/admin/idiomas');
        if (!res.ok) throw new Error("Erro ao buscar idiomas");
        const idiomas = await res.json();

        tbody.innerHTML = '';
        if (idiomas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:20px;">Nenhum idioma cadastrado.</td></tr>';
            return;
        }

        idiomas.forEach(idioma => {
            const tr = document.createElement('tr');
            
            // Determina a bandeira
            let flagUrl = 'https://flagcdn.com/w20/br.png'; // default
            if (idioma.flag === 'us') flagUrl = 'https://flagcdn.com/w20/us.png';
            if (idioma.flag === 'pt') flagUrl = 'https://flagcdn.com/w20/pt.png';
            if (idioma.flag === 'globe') flagUrl = 'https://www.svgrepo.com/show/508684/globe.svg'; // globe fallback

            tr.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${flagUrl}" alt="" style="width: 20px; border-radius: 2px; height: auto;">
                        <span>${idioma.ma03nome}</span>
                    </div>
                </td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end; gap: 8px;">
                        <button class="btn-action btn-edit" onclick="prepararEdicao(${idioma.id}, '${idioma.ma03nome.replace(/'/g, "\\'")}')" title="Editar">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action btn-block" onclick="excluirIdioma(${idioma.id})" title="Excluir" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar tabela de idiomas:", error);
        tbody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:red; padding:20px;">Erro ao carregar idiomas.</td></tr>`;
    }
}

// 3. Função que o botão do lápis (HTML) chama
function prepararEdicao(id, nomeAtual) {
    modoEdicaoIdioma = true;
    idIdiomaEditando = id;

    // Abre o formulário se estiver escondido
    const formContainer = document.getElementById('formLingua');
    if (formContainer && (formContainer.style.display === 'none' || formContainer.style.display === '')) {
        toggleFormulario('formLingua');
    }

    // Preenche o campo de texto com o nome atual
    const inputNome = document.getElementById('ma03nome');
    if (inputNome) {
        inputNome.value = nomeAtual;
        inputNome.focus();
    }

    // Muda o texto do botão para o usuário saber que está editando
    const btnSalvar = document.querySelector('#formCadastrarLingua .primary-btn');
    if (btnSalvar) {
        btnSalvar.innerText = "Atualizar Idioma";
    }
}

// 4. Lógica de envio (Submit) do formulário
document.getElementById('formCadastrarLingua')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nomeIdioma = document.getElementById('ma03nome').value.trim();
    const btnSalvar = e.target.querySelector('.primary-btn');

    // Define a URL e o Método dependendo se é edição ou cadastro novo
    const url = modoEdicaoIdioma 
        ? `/api/admin/idiomas/${idIdiomaEditando}` 
        : '/api/admin/idiomas';
    
    const metodo = modoEdicaoIdioma ? 'PUT' : 'POST';

    try {
        btnSalvar.innerText = "Processando...";
        btnSalvar.disabled = true;

        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ma03nome: nomeIdioma })
        });

        if (response.ok) {
            alert(modoEdicaoIdioma ? "Idioma atualizado!" : "Idioma cadastrado!");
            
            // Limpa tudo e volta ao estado normal
            resetarFormIdioma();
            // Recarrega a tabela
            carregarTabelaIdiomas(); 
        } else {
            alert("Erro ao salvar idioma.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao salvar idioma.");
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.innerText = modoEdicaoIdioma ? "Atualizar Idioma" : "Salvar Idioma";
    }
});

// 5. Excluir idioma
async function excluirIdioma(id) {
    if (!confirm("Deseja realmente excluir este idioma?")) return;

    try {
        const response = await fetch(`/api/admin/idiomas/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Idioma excluído com sucesso!");
            carregarTabelaIdiomas();
        } else {
            alert("Erro ao excluir idioma.");
        }
    } catch (error) {
        console.error("Erro ao excluir idioma:", error);
    }
}

// 6. Função para resetar o formulário (chame isso no botão Cancelar também)
function resetarFormIdioma() {
    modoEdicaoIdioma = false;
    idIdiomaEditando = null;
    const form = document.getElementById('formCadastrarLingua');
    if (form) form.reset();
    
    const btnSalvar = document.querySelector('#formCadastrarLingua .primary-btn');
    if (btnSalvar) btnSalvar.innerText = "Salvar Idioma";
    
    const formContainer = document.getElementById('formLingua');
    if (formContainer) formContainer.style.display = 'none';
}

// Inicializar na carga da página
document.addEventListener("DOMContentLoaded", () => {
    carregarTabelaIdiomas();
});

// Tornar as funções globais para que onclick nos elementos as encontrem
window.prepararEdicao = prepararEdicao;
window.excluirIdioma = excluirIdioma;
window.resetarFormIdioma = resetarFormIdioma;