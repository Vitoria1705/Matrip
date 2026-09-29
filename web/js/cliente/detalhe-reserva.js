function obterParametroIdReserva() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function buscarReservaPorId(idReserva) {
  return reservasMock.find((item) => item.idReserva === idReserva) || null;
}

function obterClassePagamento(statusPagamento) {
  const mapa = {
    aprovado: "payment-badge payment-badge--aprovado",
    pendente: "payment-badge payment-badge--pendente",
    estornado: "payment-badge payment-badge--estornado"
  };

  return mapa[statusPagamento] || "payment-badge";
}

function formatarMetodoPagamento(metodo) {
  const mapa = {
    pix: "Pix",
    cartao: "Cartão"
  };

  return mapa[metodo] || metodo || "-";
}

function renderizarImagemReserva(reserva) {
  const imagemReserva = document.getElementById("imagemReserva");
  const imagem = obterImagemPasseio(reserva);

  if (!imagemReserva) return;

  if (!imagem || !imagem.trim()) {
    imagemReserva.innerHTML = `
      <div class="reserva-card__placeholder">
        <i class="fa-solid fa-map-location-dot"></i>
        <strong>Matrip</strong>
        <span>Imagem indisponível</span>
      </div>
    `;
    return;
  }

  imagemReserva.innerHTML = `
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

function preencherTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

function renderizarLista(id, itens) {
  const lista = document.getElementById(id);
  if (!lista) return;

  lista.innerHTML = "";

  if (!Array.isArray(itens) || !itens.length) {
    lista.innerHTML = "<li>Não informado</li>";
    return;
  }

  itens.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    lista.appendChild(li);
  });
}

function renderizarParticipantes(reserva) {
  const participantesGrid = document.getElementById("participantesGrid");
  if (!participantesGrid) return;

  participantesGrid.innerHTML = "";

  reserva.participantes.forEach((participante, index) => {
    const card = document.createElement("article");
    card.className = "participante-card";

    card.innerHTML = `
      <div class="participante-card__top">
        <h3>${participante.nome}</h3>
        <span class="status-badge status-badge--confirmada">
          ${participante.tipoTarifa}
        </span>
      </div>
      <p><strong>Participante ${index + 1}</strong></p>
      <p>Idade: ${participante.idade} anos</p>
      <p>Documento: ${participante.documento}</p>
    `;

    participantesGrid.appendChild(card);
  });
}

function renderizarReserva(reserva) {
  document.getElementById("detalheLayout").classList.remove("hidden");

  preencherTexto("tituloReserva", reserva.passeio.nome);
  preencherTexto(
    "subtituloReserva",
    `${reserva.passeio.cidade} - ${reserva.passeio.estado} • Reserva #${reserva.idReserva}`
  );

  preencherTexto("nomePasseio", reserva.passeio.nome);
  preencherTexto("localPasseio", `${reserva.passeio.local} • ${reserva.passeio.cidade} - ${reserva.passeio.estado}`);
  preencherTexto("descricaoPasseio", reserva.passeio.descricao);

  preencherTexto("dataPasseio", formatarData(reserva.passeio.dataPasseio));
  preencherTexto("horarioPasseio", reserva.passeio.horarios?.[0] || "Horário não informado");
  preencherTexto("totalParticipantes", `${contarParticipantes(reserva)} participante(s)`);
  preencherTexto("valorTotal", formatarMoeda(reserva.pagamento.valor));

  preencherTexto("idReserva", String(reserva.idReserva));
  preencherTexto("categoriaPasseio", reserva.passeio.categoria);
  preencherTexto("classificacaoPasseio", reserva.passeio.classificacao || "Não informada");
  preencherTexto(
    "localCompletoPasseio",
    `${reserva.passeio.local} - ${reserva.passeio.cidade}/${reserva.passeio.estado}`
  );

  preencherTexto("pagamentoStatusTexto", obterStatusPagamentoLabel(reserva.pagamento.status));
  preencherTexto("pagamentoMetodo", formatarMetodoPagamento(reserva.pagamento.metodo));
  preencherTexto("pagamentoParcelas", `${reserva.pagamento.parcelas}x`);
  preencherTexto("pagamentoTransacao", reserva.pagamento.transactionId || "-");

  const statusReserva = document.getElementById("statusReserva");
  const statusPagamento = document.getElementById("statusPagamento");

  if (statusReserva) {
    statusReserva.className = obterStatusClass(reserva.statusReserva);
    statusReserva.textContent = obterStatusLabel(reserva.statusReserva);
  }

  if (statusPagamento) {
    statusPagamento.className = obterClassePagamento(reserva.pagamento.status);
    statusPagamento.textContent = obterStatusPagamentoLabel(reserva.pagamento.status);
  }

  renderizarImagemReserva(reserva);
  renderizarLista("incluiList", reserva.passeio.inclui);
  renderizarLista("embarqueList", reserva.passeio.locaisEmbarque);
  renderizarParticipantes(reserva);
}

function exibirReservaNaoEncontrada() {
  document.getElementById("reservaNaoEncontrada").classList.remove("hidden");
}

function configurarEventos() {
  const btnAjuda = document.getElementById("btnAjuda");

  if (btnAjuda) {
    btnAjuda.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "suporte.html";
    });
}
}



// Inicializa a página de detalhe da reserva.
function inicializarDetalheReserva() {
  const idReserva = obterParametroIdReserva();
  const reserva = buscarReservaPorId(idReserva);

  if (!idReserva || !reserva) {
    exibirReservaNaoEncontrada();
    configurarLogout();
    return;
  }

  renderizarReserva(reserva);
  configurarEventos();
  configurarLogout();
}

document.addEventListener("DOMContentLoaded", inicializarDetalheReserva);