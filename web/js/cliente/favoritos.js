let favoritosFiltrados = [...favoritosMock];

const favoritosGrid = document.getElementById("favoritosGrid");
const emptyState = document.getElementById("emptyState");
const buscaFavorito = document.getElementById("buscaFavorito");
const btnLimparBusca = document.getElementById("btnLimparBusca");
const resultadoTexto = document.getElementById("resultadoTexto");

function obterDescricaoFavorito(favorito) {
  const reservaRelacionada = reservasMock.find((item) => item.passeio.id === favorito.id);

  if (reservaRelacionada) {
    return reservaRelacionada.passeio.descricao;
  }

  return "Passeio salvo para consulta futura.";
}

function obterCategoriaFavorito(favorito) {
  const reservaRelacionada = reservasMock.find((item) => item.passeio.id === favorito.id);

  if (reservaRelacionada) {
    return reservaRelacionada.passeio.categoria;
  }

  return "Passeio";
}

function obterValorFavorito(favorito) {
  const reservaRelacionada = reservasMock.find((item) => item.passeio.id === favorito.id);

  if (reservaRelacionada) {
    return reservaRelacionada.passeio.valorFinal;
  }

  return 0;
}

function obterImagemFavorito(favorito) {
  const reservaRelacionada = reservasMock.find((item) => item.passeio.id === favorito.id);

  if (reservaRelacionada) {
    return obterImagemPasseio(reservaRelacionada);
  }

  return "";
}

function criarImagemFavorito(favorito) {
  const imagem = obterImagemFavorito(favorito);

  if (!imagem || !imagem.trim()) {
    return `
      <div class="favorito-card__placeholder">
        <i class="fa-solid fa-heart"></i>
        <strong>Matrip</strong>
        <span>Imagem indisponível</span>
      </div>
    `;
  }

  return `
    <img
      src="${imagem}"
      alt="${favorito.nome}"
      onerror="this.style.display='none'; this.parentElement.innerHTML=\`
        <div class='favorito-card__placeholder'>
          <i class='fa-solid fa-heart'></i>
          <strong>Matrip</strong>
          <span>Imagem indisponível</span>
        </div>
      \`;"
    />
  `;
}

function atualizarResumo(lista) {
  const totalFavoritos = document.getElementById("totalFavoritos");
  totalFavoritos.textContent = String(lista.length).padStart(2, "0");
}

function renderizarFavoritos(lista) {
  favoritosGrid.innerHTML = "";

  if (!lista.length) {
    emptyState.classList.remove("hidden");
    favoritosGrid.classList.add("hidden");
    resultadoTexto.textContent = "Nenhum favorito corresponde à busca informada.";
    atualizarResumo(lista);
    return;
  }

  emptyState.classList.add("hidden");
  favoritosGrid.classList.remove("hidden");

  resultadoTexto.textContent =
    lista.length === 1
      ? "1 favorito encontrado com a busca atual."
      : `${lista.length} favoritos encontrados com a busca atual.`;

  lista.forEach((favorito) => {
    const article = document.createElement("article");
    article.className = "favorito-card";

    const categoria = obterCategoriaFavorito(favorito);
    const descricao = obterDescricaoFavorito(favorito);
    const valor = obterValorFavorito(favorito);

    article.innerHTML = `
      <div class="favorito-card__image">
        ${criarImagemFavorito(favorito)}
      </div>

      <div class="favorito-card__body">
        <div>
          <h3 class="favorito-card__title">${favorito.nome}</h3>
          <p class="favorito-card__city">${favorito.cidade} - ${favorito.estado}</p>
        </div>

        <p class="favorito-card__description">${descricao}</p>

        <div class="favorito-card__meta">
          <span><i class="fa-solid fa-tag"></i>${categoria}</span>
          <span><i class="fa-solid fa-location-dot"></i>${favorito.cidade} - ${favorito.estado}</span>
        </div>

        <div class="favorito-card__footer">
          <div class="favorito-card__price">
            <small>Valor inicial</small>
            <strong>${valor ? formatarMoeda(valor) : "A consultar"}</strong>
          </div>

          <div class="favorito-card__actions">
            <a href="../../index.html" class="btn-card btn-card--secondary">Ver passeio</a>
            <button type="button" class="btn-card btn-card--primary" data-id="${favorito.id}" data-action="remover">
              Remover
            </button>
          </div>
        </div>
      </div>
    `;

    favoritosGrid.appendChild(article);
  });

  atualizarResumo(lista);
}

function aplicarBusca() {
  const termo = buscaFavorito.value.trim().toLowerCase();

  favoritosFiltrados = favoritosMock.filter((favorito) => {
    const categoria = obterCategoriaFavorito(favorito);

    const textoBase = `
      ${favorito.nome}
      ${favorito.cidade}
      ${favorito.estado}
      ${categoria}
    `.toLowerCase();

    return !termo || textoBase.includes(termo);
  });

  renderizarFavoritos(favoritosFiltrados);
}

function limparBusca() {
  buscaFavorito.value = "";
  favoritosFiltrados = [...favoritosMock];
  renderizarFavoritos(favoritosFiltrados);
}

function configurarEventos() {
  buscaFavorito.addEventListener("input", aplicarBusca);
  btnLimparBusca.addEventListener("click", limparBusca);

  document.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    const id = event.target.dataset.id;

    if (!action || !id) return;

    if (action === "remover") {
      event.preventDefault();
      alert(`Remoção do favorito ${id}: integração futura.`);
    }
  });
}


// Inicializa a página de favoritos.
function inicializarFavoritos() {
  renderizarFavoritos(favoritosFiltrados);
  configurarEventos();
  configurarLogout();
}

document.addEventListener("DOMContentLoaded", inicializarFavoritos);