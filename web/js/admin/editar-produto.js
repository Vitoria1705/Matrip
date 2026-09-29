const API_BASE_URL = "";

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Pega o ID do produto pela URL (?id=30)
    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get('id');

    if (!produtoId) {
        alert("Erro: ID do produto não encontrado!");
        window.location.href = 'gerenciar-produtos.html';
        return;
    }

    // Variável para armazenar os dados originais (caso precise no submit)
    let produtoOriginal = null;

    // 2. Busca os dados do produto no Banco
    try {
        // 2. Busca as categorias disponíveis no Banco
        const resCat = await fetch(`${API_BASE_URL}/categorias`);
        if (resCat.ok) {
            const categorias = await resCat.json();
            const catSelect = document.getElementById('fk11idcategoria');
            if (catSelect) {
                catSelect.innerHTML = categorias.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('');
            }
        }

        // 3. Busca os dados do produto no Banco
        const response = await fetch(`${API_BASE_URL}/passeios/${produtoId}`);
        if (!response.ok) throw new Error("Produto não encontrado");
        
        produtoOriginal = await response.json();

        // 4. Preenche os campos do formulário (Passo 1)
        document.getElementById('ma12nome').value = produtoOriginal.local || produtoOriginal.nome || "";
        document.getElementById('ma12descricao').value = produtoOriginal.descricao || "";
        document.getElementById('ma12idademinima').value = produtoOriginal.idade_minima || 0;
        document.getElementById('ma12alturaminima').value = produtoOriginal.altura_minima || 0;
        document.getElementById('ma12pesominimo').value = produtoOriginal.peso_minimo || 0;
        document.getElementById('ma12pesomaximo').value = produtoOriginal.peso_maximo || 0;
        document.getElementById('ma12transfer').value = produtoOriginal.transfer || 0;
        document.getElementById('ma12tprodutodestaque').value = produtoOriginal.destaque || 0;

        // Preencher Localização e Preços
        if (document.getElementById('fk09idestado')) document.getElementById('fk09idestado').value = produtoOriginal.estado || "";
        if (document.getElementById('fk10idcidade')) document.getElementById('fk10idcidade').value = produtoOriginal.cidade || "";
        if (document.getElementById('fk11idcategoria')) document.getElementById('fk11idcategoria').value = produtoOriginal.categoria || "";
        
        if (document.getElementById('valorAdulto')) document.getElementById('valorAdulto').value = produtoOriginal.valor_adulto || 0;
        if (document.getElementById('valorEstudante')) document.getElementById('valorEstudante').value = produtoOriginal.valor_estudante || 0;
        if (document.getElementById('valorCrianca')) document.getElementById('valorCrianca').value = produtoOriginal.valor_crianca || 0;
        if (document.getElementById('valorFinal')) document.getElementById('valorFinal').value = produtoOriginal.valor_final || 0;

        // 5. Lógica para Serviços (Passo 3)
        if (produtoOriginal.servicos && produtoOriginal.servicos.length > 0) {
            const containerTabela = document.getElementById('containerTabelaServicos');
            if (containerTabela) containerTabela.style.display = 'block';
        }

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar informações do produto.");
    }

    // 6. Lógica de SUBMIT (Atualizar os dados)
    document.getElementById('formEditarProduto')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dadosAtualizados = {
            local: document.getElementById('ma12nome').value,
            descricao: document.getElementById('ma12descricao').value,
            idade_minima: document.getElementById('ma12idademinima').value,
            altura_minima: document.getElementById('ma12alturaminima').value,
            peso_minimo: document.getElementById('ma12pesominimo').value,
            peso_maximo: document.getElementById('ma12pesomaximo').value,
            transfer: document.getElementById('ma12transfer').value,
            destaque: document.getElementById('ma12tprodutodestaque').value,
            estado: document.getElementById('fk09idestado').value,
            cidade: document.getElementById('fk10idcidade').value,
            categoria: document.getElementById('fk11idcategoria').value,
            valor_adulto: Number(document.getElementById('valorAdulto').value || 0),
            valor_estudante: Number(document.getElementById('valorEstudante').value || 0),
            valor_crianca: Number(document.getElementById('valorCrianca').value || 0),
            valor_final: Number(document.getElementById('valorFinal').value || 0)
        };

        try {
            const res = await fetch(`${API_BASE_URL}/passeios/${produtoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            });

            if (res.ok) {
                alert("Produto atualizado com sucesso!");
                window.location.href = 'gerenciar-produtos.html';
            } else {
                alert("Erro ao atualizar produto.");
            }
        } catch (err) {
            console.error("Erro na requisição:", err);
            alert("Erro de conexão com o servidor.");
        }
    });
});

/**
 * Função de Navegação entre as Abas (Steps)
 * Definida fora do DOMContentLoaded para ser acessível pelo 'onclick' do HTML
 */
function goToStep(step) {
    // 1. Esconde todos os conteúdos
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    
    // 2. Mostra o conteúdo do passo atual
    const targetStep = document.getElementById('step-' + step);
    if (targetStep) targetStep.classList.add('active');
    
    // 3. Atualiza as abas (Tabs) no topo
    document.querySelectorAll('.tab-item').forEach((item, index) => {
        if (index + 1 === step) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 4. Joga o scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}