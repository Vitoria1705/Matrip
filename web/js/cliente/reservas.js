let reservasFiltradas = [...reservasMock];

const reservasGrid = document.getElementById("reservasGrid");
const emptyState = document.getElementById("emptyState");
const buscaReserva = document.getElementById("buscaReserva");
const filtroStatus = document.getElementById("filtroStatus");
const btnLimparFiltros = document.getElementById("btnLimparFiltros");
const resultadoTexto = document.getElementById("resultadoTexto");

function atualizarResumo(lista) {
  const totalReservas = document.getElementById("totalReservas");
  const totalConfirmadas = document.getElementById("totalConfirmadas");
  const totalPendentes = document.getElementById("totalPendentes");
  const totalCanceladas = document.getElementById("totalCanceladas");

  const confirmadas = lista.filter((item) => item.statusReserva === "confirmada").length;
  const pendentes = lista.filter((item) => item.statusReserva === "pendente").length;
  const canceladas = lista.filter((item) => item.statusReserva === "cancelada").length;

  totalReservas.textContent = String(lista.length).padStart(2, "0");
  totalConfirmadas.textContent = String(confirmadas).padStart(2, "0");
  totalPendentes.textContent = String(pendentes).padStart(2, "0");
  totalCanceladas.textContent = String(canceladas).padStart(2, "0");
}

function criarImagemReserva(reserva) {
  const imagem = obterImagemPasseio(reserva);

  if (!imagem || !imagem.trim()) {
    return `
      <div class="reserva-card__placeholder">
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
        <div class='reserva-card__placeholder'>
          <i class='fa-solid fa-map-location-dot'></i>
          <strong>Matrip</strong>
          <span>Imagem indisponível</span>
        </div>
      \`;"
    />
  `;
}

function renderizarReservas(lista) {
  reservasGrid.innerHTML = "";

  if (!lista.length) {
    emptyState.classList.remove("hidden");
    reservasGrid.classList.add("hidden");
    resultadoTexto.textContent = "Nenhuma reserva corresponde aos filtros informados.";
    atualizarResumo(lista);
    return;
  }

  emptyState.classList.add("hidden");
  reservasGrid.classList.remove("hidden");

  resultadoTexto.textContent =
    lista.length === 1
      ? "1 reserva encontrada com os filtros atuais."
      : `${lista.length} reservas encontradas com os filtros atuais.`;

  lista.forEach((reserva) => {
    const article = document.createElement("article");
    article.className = "reserva-card";

    article.innerHTML = `
      <div class="reserva-card__image">
        ${criarImagemReserva(reserva)}
      </div>

      <div class="reserva-card__body">
        <div class="reserva-card__top">
          <div>
            <h3 class="reserva-card__title">${reserva.passeio.nome}</h3>
            <p class="reserva-card__city">${reserva.passeio.cidade} - ${reserva.passeio.estado}</p>
          </div>
          <span class="${obterStatusClass(reserva.statusReserva)}">
            ${obterStatusLabel(reserva.statusReserva)}
          </span>
        </div>

        <p class="reserva-card__description">${reserva.passeio.descricao}</p>

        <div class="reserva-card__meta">
          <span><i class="fa-regular fa-calendar"></i>${formatarData(reserva.passeio.dataPasseio)}</span>
          <span><i class="fa-regular fa-clock"></i>${reserva.passeio.horarios?.[0] || "Horário não informado"}</span>
          <span><i class="fa-solid fa-user-group"></i>${contarParticipantes(reserva)} participante(s)</span>
          <span><i class="fa-solid fa-wallet"></i>${obterStatusPagamentoLabel(reserva.pagamento.status)}</span>
        </div>

        <div class="reserva-card__footer">
          <div class="reserva-card__price">
            <small>Valor total</small>
            <strong>${formatarMoeda(reserva.pagamento.valor)}</strong>
          </div>

          <div class="reserva-card__actions">
            <a href="#" class="btn-card btn-card--secondary" data-id="${reserva.idReserva}" data-action="detalhes">Detalhes</a>
            <a href="#" class="btn-card btn-card--primary" data-id="${reserva.idReserva}" data-action="suporte">Suporte</a>
          </div>
        </div>
      </div>
    `;

    reservasGrid.appendChild(article);
  });

  atualizarResumo(lista);
}

function aplicarFiltros() {
  const termo = buscaReserva.value.trim().toLowerCase();
  const status = filtroStatus.value;

  reservasFiltradas = reservasMock.filter((reserva) => {
    const textoBase = `
      ${reserva.passeio.nome}
      ${reserva.passeio.cidade}
      ${reserva.passeio.estado}
      ${reserva.passeio.local}
      ${reserva.passeio.descricao}
      ${reserva.passeio.categoria}
    `.toLowerCase();

    const atendeBusca = !termo || textoBase.includes(termo);
    const atendeStatus = status === "todos" || reserva.statusReserva === status;

    return atendeBusca && atendeStatus;
  });

  renderizarReservas(reservasFiltradas);
}

function limparFiltros() {
  buscaReserva.value = "";
  filtroStatus.value = "todos";
  reservasFiltradas = [...reservasMock];
  renderizarReservas(reservasFiltradas);
}

function configurarEventos() {
  buscaReserva.addEventListener("input", aplicarFiltros);
  filtroStatus.addEventListener("change", aplicarFiltros);

  btnLimparFiltros.addEventListener("click", limparFiltros);

  document.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    const id = event.target.dataset.id;

    if (!action || !id) return;

    event.preventDefault();

    if (action === "detalhes") {
     window.location.href = `detalhe-reserva.html?id=${id}`;
    }
    if (action === "suporte") {
     window.location.href = "suporte.html";
}
  });
}

// Inicializa a página de reservas.
function inicializar() {
  renderizarReservas(reservasFiltradas);
  configurarEventos();
  configurarLogout();
}

document.addEventListener("DOMContentLoaded", inicializar);