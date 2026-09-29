document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastrarAgencia');
    const selectPais = document.getElementById('ma05Pais');
    const selectUF = document.getElementById('ma05UF');
    const selectCidade = document.getElementById('ma05Cidade');
    const btnSalvar = document.getElementById('btnSalvarAgencia');
    const messageBox = document.getElementById('messageBox');

    // --- PARTE 1: LÓGICA DE CASCATA (PAÍS -> UF -> CIDADE) ---

    // 1. Carrega Países ao abrir a página
    fetch('/api/localidades/paises')
        .then(res => res.json())
        .then(paises => {
            paises.forEach(p => selectPais.add(new Option(p.nome, p.id)));
        })
        .catch(err => console.error("Erro ao carregar países:", err));

    // 2. Evento ao mudar o País -> Carrega Estados (UF)
    selectPais.addEventListener('change', async () => {
        const paisId = selectPais.value;
        selectUF.innerHTML = '<option value="" disabled selected>Carregando...</option>';
        selectUF.disabled = true;
        selectCidade.innerHTML = '<option value="" disabled selected>Selecione a Cidade</option>';
        selectCidade.disabled = true;

        if (paisId) {
            try {
                const res = await fetch(`/api/localidades/ufs/${paisId}`);
                const ufs = await res.json();
                selectUF.innerHTML = '<option value="" disabled selected>Selecione o Estado</option>';
                ufs.forEach(uf => selectUF.add(new Option(uf.nome, uf.id)));
                selectUF.disabled = false;
            } catch (err) { console.error("Erro ao carregar UFs:", err); }
        }
    });

    // 3. Evento ao mudar UF -> Carrega Cidades
    selectUF.addEventListener('change', async () => {
        const ufId = selectUF.value;
        selectCidade.innerHTML = '<option value="" disabled selected>Carregando...</option>';
        selectCidade.disabled = true;

        if (ufId) {
            try {
                const res = await fetch(`/api/localidades/cidades/${ufId}`);
                const cidades = await res.json();
                selectCidade.innerHTML = '<option value="" disabled selected>Selecione a Cidade</option>';
                cidades.forEach(c => selectCidade.add(new Option(c.nome, c.id)));
                selectCidade.disabled = false;
            } catch (err) { console.error("Erro ao carregar cidades:", err); }
        }
    });


    // --- PARTE 2: ENVIO DO FORMULÁRIO (FINALIZAR CADASTRO) ---

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede a página de recarregar

        // Coleta os dados do formulário
        const formData = {
            ma05Fantasia: document.getElementById('ma05Fantasia').value,
            ma05RSocial: document.getElementById('ma05RSocial').value,
            ma05CNPJ: document.getElementById('ma05CNPJ').value,
            ma05Email: document.getElementById('ma05Email').value,
            ma05homepage: document.getElementById('ma05homepage').value,
            ma05telefone: document.getElementById('ma05telefone').value,
            ma05celular: document.getElementById('ma05celular').value,
            ma05Endereco: document.getElementById('ma05Endereco').value,
            ma05Bairro: document.getElementById('ma05Bairro').value,
            ma05Cidade: selectCidade.value, // ENVIANDO APENAS A CIDADE PRO BANCO
            ma05status: document.getElementById('ma05status').value
        };

        // Feedback visual no botão
        btnSalvar.innerText = "Salvando...";
        btnSalvar.disabled = true;

        try {
            const response = await fetch('/api/admin/agencias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                exibirMensagem("Agência cadastrada com sucesso!", "success");
                form.reset();
                // Resetar selects manuais
                selectUF.disabled = true;
                selectCidade.disabled = true;
            } else {
                exibirMensagem(result.error || "Erro ao cadastrar agência.", "error");
            }
        } catch (error) {
            exibirMensagem("Erro de conexão com o servidor.", "error");
        } finally {
            btnSalvar.innerText = "Finalizar Cadastro";
            btnSalvar.disabled = false;
        }
    });

    // Função auxiliar para mensagens na tela
    function exibirMensagem(texto, tipo) {
        messageBox.innerText = texto;
        messageBox.className = `message-box ${tipo}`;
        messageBox.classList.remove('hidden');
        setTimeout(() => messageBox.classList.add('hidden'), 5000);
    }
});