function obterLabelTipoUsuario(tipo) {
  const mapa = {
    admin: "Administrador",
    usuario: "Cliente",
    guia: "Guia"
  };

  return mapa[tipo] || tipo || "Usuário";
}

function obterLabelProvider(provider) {
  const mapa = {
    google: "login Google",
    facebook: "login Facebook",
    local: "login local"
  };

  if (!provider) return "login local";
  return mapa[provider] || provider;
}

function preencherTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

function renderizarResumoUsuario(usuario) {
  const primeiroNome = obterPrimeiroNome(usuario.nome);
  const avatar = document.getElementById("perfilAvatar");

  if (avatar) {
    avatar.textContent = primeiroNome.charAt(0).toUpperCase();
  }

  preencherTexto("perfilNome", usuario.nome || "Usuário Matrip");
  preencherTexto("perfilEmail", usuario.email || "email não informado");
  preencherTexto("perfilTipo", obterLabelTipoUsuario(usuario.tipo));
  preencherTexto("perfilProvider", obterLabelProvider(usuario.provider));
}

function renderizarDadosConta(usuario) {
  preencherTexto("infoNome", usuario.nome || "-");
  preencherTexto("infoEmail", usuario.email || "-");
  preencherTexto("infoTipo", obterLabelTipoUsuario(usuario.tipo));
  preencherTexto("infoProvider", obterLabelProvider(usuario.provider));
  preencherTexto("infoProviderId", usuario.provider_id || usuario.providerId || "-");
}

function renderizarEstatisticas() {
  const totalReservas = reservasMock.length;
  const totalConfirmadas = reservasMock.filter((item) => item.statusReserva === "confirmada").length;
  const totalFavoritos = favoritosMock.length;
  const totalPagamentosAprovados = reservasMock.filter(
    (item) => item.pagamento.status === "aprovado"
  ).length;


  preencherTexto("statReservas", String(totalReservas).padStart(2, "0"));
  preencherTexto("statConfirmadas", String(totalConfirmadas).padStart(2, "0"));
  preencherTexto("statFavoritos", String(totalFavoritos).padStart(2, "0"));
  preencherTexto("statPagamentos", String(totalPagamentosAprovados).padStart(2, "0"));
}
// Inicializa a página de perfil.
function inicializarPerfil() {
  const usuario = obterUsuarioLogado();

  renderizarResumoUsuario(usuario);
  renderizarDadosConta(usuario);
  renderizarEstatisticas();
  configurarLogout();
}

document.addEventListener("DOMContentLoaded", inicializarPerfil);