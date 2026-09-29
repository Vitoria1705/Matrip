function renderizarUsuario() {
  const usuario = obterUsuarioLogado();
  const primeiroNome = obterPrimeiroNome(usuario.nome);

  const welcomeTitle = document.getElementById("welcomeTitle");
  const welcomeText = document.getElementById("welcomeText");

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${primeiroNome}. Bem-vindo(a) à sua área Matrip.`;
  }

  if (welcomeText) {
    welcomeText.textContent =
      "Acompanhe suas reservas, seus pagamentos e os detalhes das próximas experiências.";
  }
}

function renderizarProximaExperiencia() {
  const proximas = ordenarReservasPorDataFutura(reservasMock);
  const nextTitle = document.getElementById("nextExperienceTitle");
  const nextMeta = document.getElementById("nextExperienceMeta");

  if (!nextTitle || !nextMeta) return;

  if (!proximas.length) {
    nextTitle.textContent = "Nenhuma reserva futura";
    nextMeta.textContent = "Faça uma nova reserva para começar.";
    return;
  }

  const proxima = proximas[0];
  nextTitle.textContent = proxima.passeio.nome;
  nextMeta.textContent =
    `${proxima.passeio.cidade} - ${proxima.passeio.estado} • ` +
    `${formatarData(proxima.passeio.dataPasseio)} • ` +
    `${obterStatusPagamentoLabel(proxima.pagamento.status)}`;
}

function renderizarResumo() {
  const totalReservas = reservasMock.length;
  const totalConfirmadas = reservasMock.filter((item) => item.statusReserva === "confirmada").length;
  const totalPendentes = reservasMock.filter((item) => item.statusReserva === "pendente").length;
  const totalFavoritos = favoritosMock.length;

  document.getElementById("totalReservas").textContent = String(totalReservas).padStart(2, "0");
  document.getElementById("totalConfirmadas").textContent = String(totalConfirmadas).padStart(2, "0");
  document.getElementById("totalPendentes").textContent = String(totalPendentes).padStart(2, "0");
  document.getElementById("totalFavoritos").textContent = String(totalFavoritos).padStart(2, "0");
}

function renderizarAtividades() {
  const activityList = document.getElementById("activityList");
  if (!activityList) return;

  activityList.innerHTML = "";

  const atividades = [...reservasMock]
    .sort(
      (a, b) =>
        new Date(`${b.passeio.dataPasseio}T12:00:00`) -
        new Date(`${a.passeio.dataPasseio}T12:00:00`)
    )
    .slice(0, 4);

  if (!atividades.length) {
    activityList.innerHTML = `
      <li class="activity-item">
        <div class="activity-item__icon">
          <i class="fa-solid fa-circle-info"></i>
        </div>
        <div class="activity-item__content">
          <strong>Nenhuma atividade recente</strong>
          <p>Assim que houver reservas ou mudanças de status, elas aparecerão aqui.</p>
        </div>
      </li>
    `;
    return;
  }

  atividades.forEach((reserva) => {
    const item = document.createElement("li");
    item.className = "activity-item";

    item.innerHTML = `
      <div class="activity-item__icon">
        <i class="fa-solid ${obterIconeAtividade(reserva.statusReserva)}"></i>
      </div>
      <div class="activity-item__content">
        <strong>${obterStatusLabel(reserva.statusReserva)}: ${reserva.passeio.nome}</strong>
        <p>
          ${reserva.passeio.cidade} - ${reserva.passeio.estado} •
          ${formatarData(reserva.passeio.dataPasseio)} •
          ${contarParticipantes(reserva)} participante(s)
        </p>
      </div>
    `;

    activityList.appendChild(item);
  });
}

function criarBlocoImagemReserva(reserva) {
  const imagem = obterImagemPasseio(reserva);

  if (!imagem || !imagem.trim()) {
    return `
      <div class="booking-card__placeholder">
        <i class="fa-solid fa-map-location-dot"></i>
        <strong>Matrip</strong>
        <span>Imagem indisponível</span>
      </div>
    `;
  }

  return `
    <img
      src="${imagem}"
      alt="${reserva.passeio.nome}"
      onerror="this.style.display='none'; this.parentElement.innerHTML=\`
        <div class='booking-card__placeholder'>
          <i class='fa-solid fa-map-location-dot'></i>
          <strong>Matrip</strong>
          <span>Imagem indisponível</span>
        </div>
      \`;"
    />
  `;
}

function renderizarPreviewReservas() {
  const bookingPreviewGrid = document.getElementById("bookingPreviewGrid");
  if (!bookingPreviewGrid) return;

  bookingPreviewGrid.innerHTML = "";

  const lista = ordenarReservasPorDataFutura(reservasMock).slice(0, 3);

  if (!lista.length) {
    bookingPreviewGrid.innerHTML = `
      <article class="booking-card">
        <div class="booking-card__image">
          <div class="booking-card__placeholder">
            <i class="fa-solid fa-suitcase-rolling"></i>
            <strong>Nenhuma reserva futura</strong>
            <span>Explore os passeios e escolha sua próxima experiência.</span>
          </div>
        </div>
        <div class="booking-card__body">
          <h3 class="booking-card__title">Sua próxima aventura começa aqui</h3>
          <p class="booking-card__description">
            Você ainda não possui reservas futuras cadastradas no sistema.
          </p>
          <div class="booking-card__footer">
            <div class="booking-card__price">
              <small>Status</small>
              <strong>Disponível para reservar</strong>
            </div>
            <div class="booking-card__actions">
              <a href="../../index.html" class="btn-card btn-card--primary">Explorar</a>
            </div>
          </div>
        </div>
      </article>
    `;
    return;
  }

  lista.forEach((reserva) => {
    const article = document.createElement("article");
    article.className = "booking-card";

    article.innerHTML = `
      <div class="booking-card__image">
        ${criarBlocoImagemReserva(reserva)}
      </div>

      <div class="booking-card__body">
        <div class="booking-card__top">
          <div>
            <h3 class="booking-card__title">${reserva.passeio.nome}</h3>
            <p class="booking-card__city">${reserva.passeio.cidade} - ${reserva.passeio.estado}</p>
          </div>
          <span class="${obterStatusClass(reserva.statusReserva)}">
            ${obterStatusLabel(reserva.statusReserva)}
          </span>
        </div>

        <p class="booking-card__description">${reserva.passeio.descricao}</p>

        <div class="booking-card__meta">
          <span><i class="fa-regular fa-calendar"></i>${formatarData(reserva.passeio.dataPasseio)}</span>
          <span><i class="fa-solid fa-user-group"></i>${contarParticipantes(reserva)} participante(s)</span>
          <span><i class="fa-solid fa-wallet"></i>${obterStatusPagamentoLabel(reserva.pagamento.status)}</span>
        </div>

        <div class="booking-card__footer">
          <div class="booking-card__price">
            <small>Valor total</small>
            <strong>${formatarMoeda(reserva.pagamento.valor)}</strong>
          </div>

          <div class="booking-card__actions">
            <a href="detalhe-reserva.html?id=${reserva.idReserva}" class="btn-card btn-card--secondary">Detalhes</a>
            <a href="#" class="btn-card btn-card--primary">Suporte</a>
          </div>
        </div>
      </div>
    `;

    bookingPreviewGrid.appendChild(article);
  });
}

function configurarEventosBasicos() {}
// Inicializa a home do cliente.
function inicializarDashboardCliente() {
  renderizarUsuario();
  renderizarProximaExperiencia();
  renderizarResumo();
  renderizarAtividades();
  renderizarPreviewReservas();
  configurarEventosBasicos();
  configurarLogout();
}

document.addEventListener("DOMContentLoaded", inicializarDashboardCliente);