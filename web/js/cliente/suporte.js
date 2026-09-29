const formSuporte = document.getElementById("formSuporte");
const btnLimparFormulario = document.getElementById("btnLimparFormulario");
const messageBox = document.getElementById("messageBox");

function preencherDadosUsuario() {
  const usuario = obterUsuarioLogado();

  const nomeSuporte = document.getElementById("nomeSuporte");
  const emailSuporte = document.getElementById("emailSuporte");

  if (nomeSuporte) {
    nomeSuporte.value = usuario.nome || "";
  }

  if (emailSuporte) {
    emailSuporte.value = usuario.email || "";
  }
}

function preencherEstatisticas() {
  const totalReservas = reservasMock.length;
  const totalPendentes = reservasMock.filter((item) => item.statusReserva === "pendente").length;
  const totalPagamentosPendentes = reservasMock.filter(
    (item) => item.pagamento.status === "pendente"
  ).length;

  document.getElementById("statReservas").textContent = String(totalReservas).padStart(2, "0");
  document.getElementById("statPendentes").textContent = String(totalPendentes).padStart(2, "0");
  document.getElementById("statPagamentosPendentes").textContent = String(totalPagamentosPendentes).padStart(2, "0");
}

function exibirMensagem(tipo, texto) {
  messageBox.className = `message-box ${tipo}`;
  messageBox.textContent = texto;
}

function limparMensagem() {
  messageBox.className = "message-box hidden";
  messageBox.textContent = "";
}

function limparFormulario() {
  formSuporte.reset();
  preencherDadosUsuario();
  limparMensagem();
}

function validarFormulario() {
  const nome = document.getElementById("nomeSuporte").value.trim();
  const email = document.getElementById("emailSuporte").value.trim();
  const assunto = document.getElementById("tipoSolicitacao").value;
  const mensagem = document.getElementById("mensagemSuporte").value.trim();

  if (!nome || !email || !assunto || !mensagem) {
    exibirMensagem("error", "Preencha os campos obrigatórios antes de enviar.");
    return false;
  }

  return true;
}

function enviarFormulario(event) {
  event.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  exibirMensagem("success", "Solicitação registrada com sucesso. A integração real será adicionada na próxima etapa.");
}

function configurarEventos() {
  formSuporte.addEventListener("submit", enviarFormulario);
  btnLimparFormulario.addEventListener("click", limparFormulario);
}

// Inicializa a página de suporte.
function inicializarSuporte() {
  preencherDadosUsuario();
  preencherEstatisticas();
  configurarEventos();
  configurarLogout();
}

document.addEventListener("DOMContentLoaded", inicializarSuporte);