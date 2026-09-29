document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega os parâmetros da URL (?nome=...&cnpj=...)
    const params = new URLSearchParams(window.location.search);
    const nomeAgencia = params.get('nome');
    const cnpjAgencia = params.get('cnpj');

    // 2. Atualiza o H1 do Topbar com o nome da agência
    const tituloH1 = document.getElementById('tituloAgencia');
    if (nomeAgencia) {
        tituloH1.innerText = `${nomeAgencia}`;
    } else {
        tituloH1.innerText = "Guias da Agência";
    }

    // Lógica para salvar guia (apenas visual por enquanto)
    document.getElementById('formCadastrarGuia')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nomeGuia = document.getElementById('guiaNome').value;
        alert(`Guia ${nomeGuia} cadastrado com sucesso para a agência ${nomeAgencia}!`);
        toggleFormulario('formNovoGuia');
    });
});