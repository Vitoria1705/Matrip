document.addEventListener('DOMContentLoaded', () => {
    carregarPaises();
});

let estadoTela = 'paises'; // paises | estados | cidades
let dadosContexto = { paisId: null, paisNome: '', ufId: null, ufNome: '' };

let modoEdicaoPais = false;
let idPaisEditando = null;

let modoEdicaoEstado = false;
let idEstadoEditando = null;

let modoEdicaoCidade = false;
let idCidadeEditando = null;

// --- NAVEGAÇÃO E VOLTAR ---
function gerenciarBotaoVoltar(e) {
    if (estadoTela === 'paises') return; // Segue o link natural para cadastros.html

    e.preventDefault();
    if (estadoTela === 'cidades') {
        abrirNivelEstados(dadosContexto.paisId, dadosContexto.paisNome);
    } else if (estadoTela === 'estados') {
        exibirPaises();
    }
}

document.getElementById('btnVoltarDinamico').addEventListener('click', gerenciarBotaoVoltar);

function exibirPaises() {
    estadoTela = 'paises';
    document.getElementById('sessaoPaises').style.display = 'block';
    document.getElementById('sessaoEstados').style.display = 'none';
    document.getElementById('sessaoCidades').style.display = 'none';
    document.getElementById('subtituloPagina').innerText = 'Clique nos títulos para abrir os formulários de cadastro.';
    carregarPaises();
}

// --- FUNÇÕES DE CARGA ---
async function carregarPaises() {
    const res = await fetch('/api/localidades/paises');
    const paises = await res.json();
    const tbody = document.getElementById('listaPaises');
    tbody.innerHTML = '';

    if (paises.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:20px;">Nenhum país cadastrado.</td></tr>';
        return;
    }

    paises.forEach(p => {
        const isBloqueado = p.status === 'bloqueado';
        const badge = isBloqueado 
            ? `<span class="status-badge inativo" style="background:#fee2e2; color:#b91c1c; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:8px; font-weight:600;">Bloqueado</span>`
            : `<span class="status-badge ativo" style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:8px; font-weight:600;">Ativo</span>`;

        tbody.innerHTML += `
            <tr onclick="abrirNivelEstados(${p.id}, '${p.nome.replace(/'/g, "\\'")}')" style="cursor:pointer">
                <td><strong>${p.nome}</strong></td>
                <td>${badge}</td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button class="btn-action btn-edit" onclick="event.stopPropagation(); editarPais(${p.id}, '${p.nome.replace(/'/g, "\\'")}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action btn-block" onclick="event.stopPropagation(); bloquearPais(${p.id})" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;" title="Bloquear/Desbloquear">
                            <span class="material-symbols-outlined">block</span>
                        </button>
                    </div>
                </td>
            </tr>`;
    });
}

async function abrirNivelEstados(id, nome) {
    estadoTela = 'estados';
    dadosContexto.paisId = id;
    dadosContexto.paisNome = nome;

    document.getElementById('sessaoPaises').style.display = 'none';
    document.getElementById('sessaoEstados').style.display = 'block';
    document.getElementById('sessaoCidades').style.display = 'none';
    document.getElementById('labelNomePais').innerText = nome;
    document.getElementById('subtituloPagina').innerText = `Países > ${nome}`;
    document.getElementById('fk08idpais').value = id;

    const res = await fetch(`/api/localidades/ufs/${id}`);
    const ufs = await res.json();
    const tbody = document.getElementById('listaEstados');
    tbody.innerHTML = '';

    ufs.forEach(uf => {
        const isBloqueado = uf.status === 'bloqueado';
        const badge = isBloqueado 
            ? `<span class="status-badge inativo" style="background:#fee2e2; color:#b91c1c; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:8px; font-weight:600;">Bloqueado</span>`
            : `<span class="status-badge ativo" style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:8px; font-weight:600;">Ativo</span>`;

        tbody.innerHTML += `
            <tr onclick="abrirNivelCidades(${uf.id}, '${uf.nome.replace(/'/g, "\\'")}')" style="cursor:pointer">
                <td>${uf.sigla}</td>
                <td><strong>${uf.nome}</strong></td>
                <td>${badge}</td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button class="btn-action btn-edit" onclick="event.stopPropagation(); editarUF(${uf.id}, '${uf.nome.replace(/'/g, "\\'")}', '${uf.sigla.replace(/'/g, "\\'")}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action btn-block" onclick="event.stopPropagation(); bloquearUF(${uf.id})" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;" title="Bloquear/Desbloquear">
                            <span class="material-symbols-outlined">block</span>
                        </button>
                    </div>
                </td>
            </tr>`;
    });
}

async function abrirNivelCidades(id, nome) {
    estadoTela = 'cidades';
    dadosContexto.ufId = id;
    dadosContexto.ufNome = nome;

    document.getElementById('sessaoEstados').style.display = 'none';
    document.getElementById('sessaoCidades').style.display = 'block';
    document.getElementById('labelNomeUF').innerText = nome;
    document.getElementById('subtituloPagina').innerText = `Países > ${dadosContexto.paisNome} > ${nome}`;
    document.getElementById('fk09iduf').value = id;

    const res = await fetch(`/api/localidades/cidades/${id}`);
    const cidades = await res.json();
    const tbody = document.getElementById('listaCidades');
    tbody.innerHTML = '';

    cidades.forEach(c => {
        const isBloqueado = c.status === 'bloqueado';
        const badge = isBloqueado 
            ? `<span class="status-badge inativo" style="background:#fee2e2; color:#b91c1c; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:8px; font-weight:600;">Bloqueado</span>`
            : `<span class="status-badge ativo" style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:8px; font-weight:600;">Ativo</span>`;

        tbody.innerHTML += `
            <tr>
                <td><strong>${c.nome}</strong></td>
                <td>${badge}</td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button class="btn-action btn-edit" onclick="editarCidade(${c.id}, '${c.nome.replace(/'/g, "\\'")}')"><span class="material-symbols-outlined">edit</span></button>
                        <button class="btn-action btn-block" onclick="bloquearCidade(${c.id})" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;" title="Bloquear/Desbloquear"><span class="material-symbols-outlined">block</span></button>
                    </div>
                </td>
            </tr>`;
    });
}

// Helper to open/close forms
function toggleFormulario(id) {
    const form = document.getElementById(id);
    if (form) {
        form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
    }
}
window.toggleFormulario = toggleFormulario;

// --- EDIT HANDLERS ---
function editarPais(id, nome) {
    modoEdicaoPais = true;
    idPaisEditando = id;
    
    const form = document.getElementById('formPais');
    if (form) form.style.display = 'block';

    const input = document.getElementById('ma08nome');
    if (input) {
        input.value = nome;
        input.focus();
    }

    const btn = document.querySelector('#formCadastrarPais .primary-btn');
    if (btn) btn.innerText = "Atualizar País";
}
window.editarPais = editarPais;

function resetarFormPais() {
    modoEdicaoPais = false;
    idPaisEditando = null;
    const form = document.getElementById('formCadastrarPais');
    if (form) form.reset();
    
    const btn = document.querySelector('#formCadastrarPais .primary-btn');
    if (btn) btn.innerText = "Salvar País";
    
    const container = document.getElementById('formPais');
    if (container) container.style.display = 'none';
}
window.resetarFormPais = resetarFormPais;

function editarUF(id, nome, sigla) {
    modoEdicaoEstado = true;
    idEstadoEditando = id;

    const form = document.getElementById('formEstado');
    if (form) form.style.display = 'block';

    const inputNome = document.getElementById('ma09nome');
    if (inputNome) {
        inputNome.value = nome;
        inputNome.focus();
    }

    const inputSigla = document.getElementById('ma09sigla');
    if (inputSigla) inputSigla.value = sigla;

    const btn = document.querySelector('#formCadastrarUF .primary-btn');
    if (btn) btn.innerText = "Atualizar Estado";
}
window.editarUF = editarUF;

function resetarFormUF() {
    modoEdicaoEstado = false;
    idEstadoEditando = null;
    const form = document.getElementById('formCadastrarUF');
    if (form) form.reset();

    const btn = document.querySelector('#formCadastrarUF .primary-btn');
    if (btn) btn.innerText = "Salvar Estado";

    const container = document.getElementById('formEstado');
    if (container) container.style.display = 'none';
}
window.resetarFormUF = resetarFormUF;

function editarCidade(id, nome) {
    modoEdicaoCidade = true;
    idCidadeEditando = id;

    const form = document.getElementById('formCidade');
    if (form) form.style.display = 'block';

    const inputNome = document.getElementById('ma10nome');
    if (inputNome) {
        inputNome.value = nome;
        inputNome.focus();
    }

    const btn = document.querySelector('#formCadastrarCidade .primary-btn');
    if (btn) btn.innerText = "Atualizar Cidade";
}
window.editarCidade = editarCidade;

function resetarFormCidade() {
    modoEdicaoCidade = false;
    idCidadeEditando = null;
    const form = document.getElementById('formCadastrarCidade');
    if (form) form.reset();

    const btn = document.querySelector('#formCadastrarCidade .primary-btn');
    if (btn) btn.innerText = "Salvar Cidade";

    const container = document.getElementById('formCidade');
    if (container) container.style.display = 'none';
}
window.resetarFormCidade = resetarFormCidade;

// --- BLOCK / UNBLOCK HANDLERS ---
async function bloquearPais(id) {
    try {
        const res = await fetch(`/api/localidades/paises/${id}/bloquear`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error("Erro ao alterar status do país");
        
        const data = await res.json();
        alert(`País alterado para status ${data.status === 'bloqueado' ? 'BLOQUEADO' : 'ATIVO'} com sucesso!`);
        carregarPaises();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}
window.bloquearPais = bloquearPais;

async function bloquearUF(id) {
    try {
        const res = await fetch(`/api/localidades/ufs/${id}/bloquear`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error("Erro ao alterar status do estado");

        const data = await res.json();
        alert(`Estado alterado para status ${data.status === 'bloqueado' ? 'BLOQUEADO' : 'ATIVO'} com sucesso!`);
        abrirNivelEstados(dadosContexto.paisId, dadosContexto.paisNome);
    } catch (err) {
        alert("Erro: " + err.message);
    }
}
window.bloquearUF = bloquearUF;

async function bloquearCidade(id) {
    try {
        const res = await fetch(`/api/localidades/cidades/${id}/bloquear`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error("Erro ao alterar status da cidade");

        const data = await res.json();
        alert(`Cidade alterada para status ${data.status === 'bloqueado' ? 'BLOQUEADO' : 'ATIVO'} com sucesso!`);
        abrirNivelCidades(dadosContexto.ufId, dadosContexto.ufNome);
    } catch (err) {
        alert("Erro: " + err.message);
    }
}
window.bloquearCidade = bloquearCidade;

// --- SUBMIT HANDLERS ---

// 1. Salvar País
document.getElementById('formCadastrarPais')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('ma08nome').value.trim();

    const url = modoEdicaoPais ? `/api/localidades/paises/${idPaisEditando}` : '/api/localidades/paises';
    const method = modoEdicaoPais ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome })
        });

        if (!res.ok) throw new Error("Erro ao salvar país");

        alert(modoEdicaoPais ? "País atualizado com sucesso!" : "País cadastrado com sucesso!");
        resetarFormPais();
        exibirPaises();
    } catch (err) {
        alert("Erro: " + err.message);
    }
});

// 2. Salvar Estado (UF)
document.getElementById('formCadastrarUF')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('ma09nome').value.trim();
    const sigla = document.getElementById('ma09sigla').value.trim();
    const paisId = document.getElementById('fk08idpais').value;

    const url = modoEdicaoEstado ? `/api/localidades/ufs/${idEstadoEditando}` : '/api/localidades/ufs';
    const method = modoEdicaoEstado ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, sigla, paisId })
        });

        if (!res.ok) throw new Error("Erro ao salvar estado");

        alert(modoEdicaoEstado ? "Estado atualizado com sucesso!" : "Estado cadastrado com sucesso!");
        resetarFormUF();
        abrirNivelEstados(dadosContexto.paisId, dadosContexto.paisNome);
    } catch (err) {
        alert("Erro: " + err.message);
    }
});

// 3. Salvar Cidade
document.getElementById('formCadastrarCidade')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('ma10nome').value.trim();
    const ufId = document.getElementById('fk09iduf').value;

    const url = modoEdicaoCidade ? `/api/localidades/cidades/${idCidadeEditando}` : '/api/localidades/cidades';
    const method = modoEdicaoCidade ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, ufId })
        });

        if (!res.ok) throw new Error("Erro ao salvar cidade");

        alert(modoEdicaoCidade ? "Cidade atualizada com sucesso!" : "Cidade cadastrada com sucesso!");
        resetarFormCidade();
        abrirNivelCidades(dadosContexto.ufId, dadosContexto.ufNome);
    } catch (err) {
        alert("Erro: " + err.message);
    }
});
