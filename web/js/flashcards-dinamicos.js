async function carregarFlashcards() {
  try {
    const res = await fetch("/home/passeios");

    if (!res.ok) {
      throw new Error(`Falha ao buscar passeios: ${res.status}`);
    }

    const passeios = await res.json();

    const containerPrincipal = document.getElementById("flashcards-container");
    if (!containerPrincipal) return;

    // após a injeção do componente, os cards entram em #homeCategorias;
    // se por algum motivo esse elemento não existir, usa o contêiner principal
    const container = document.getElementById("homeCategorias") || containerPrincipal;
    container.innerHTML = "";

    if (!Array.isArray(passeios) || passeios.length === 0) {
      container.innerHTML = `
        <p class="text-center text-muted">
          Nenhum passeio disponível no momento.
        </p>
      `;
      return;
    }

    const categorias = {};

    passeios.forEach((passeio) => {
      const categoria = (passeio.categoria || "Outros").trim();

      if (!categorias[categoria]) {
        categorias[categoria] = [];
      }

      categorias[categoria].push(passeio);
    });

    Object.keys(categorias).forEach((categoria) => {
      const lista = categorias[categoria];
      const principais = lista.slice(0, 3);
      const extras = lista.slice(3);

      const section = document.createElement("section");
      section.className = "categoria mb-5";

      section.innerHTML = `
        <h3>${capitalizar(categoria)}</h3>

        <div class="cards-row"></div>

        ${extras.length > 0 ? `<div class="cards-row extras"></div>` : ""}

        ${extras.length > 0 ? `<button class="btn-vermais" type="button">Ver mais</button>` : ""}
      `;

      const rowPrincipais = section.querySelector(".cards-row");
      principais.forEach((passeio) => {
        rowPrincipais.appendChild(criarCard(passeio));
      });

      if (extras.length > 0) {
        const rowExtras = section.querySelector(".cards-row.extras");
        extras.forEach((passeio) => {
          rowExtras.appendChild(criarCard(passeio));
        });

        const btnVerMais = section.querySelector(".btn-vermais");

        btnVerMais.addEventListener("click", () => {
          rowExtras.classList.toggle("show");
          btnVerMais.textContent = rowExtras.classList.contains("show")
            ? "Ver menos"
            : "Ver mais";
        });
      }

      container.appendChild(section);
    });
  } catch (erro) {
    console.error("Erro ao carregar flashcards:", erro);

    const container =
      document.getElementById("homeCategorias") ||
      document.getElementById("flashcards-container");

    if (container) {
      container.innerHTML = `
        <p class="text-center text-muted">
          Não foi possível carregar os passeios agora.
        </p>
      `;
    }
  }
}

function criarCard(passeio) {
  const card = document.createElement("div");
  card.className = "card";

  const imagem = passeio.imagem
    ? `/uploads/${passeio.imagem}`
    : `/uploads/default.jpg`;

  const adulto = passeio.valor_adulto
    ? `<li><i class="fa-solid fa-user"></i> Adultos: <strong>R$ ${formatar(passeio.valor_adulto)}</strong></li>`
    : "";

  const estudante = passeio.valor_estudante
    ? `<li><i class="fa-solid fa-graduation-cap"></i> Estudantes: <strong>R$ ${formatar(passeio.valor_estudante)}</strong></li>`
    : "";

  const crianca = passeio.valor_crianca
    ? `<li><i class="fa-solid fa-child"></i> Crianças: <strong>R$ ${formatar(passeio.valor_crianca)}</strong></li>`
    : "";

  card.innerHTML = `
    <img src="${imagem}" alt="${escapeHtml(passeio.local || "Passeio")}" />
    <div class="card-body">
      <h5 class="card-title">${escapeHtml(passeio.local || "Sem local")}</h5>
      <p class="card-text">${escapeHtml(passeio.descricao || "")}</p>

      <div class="card-prices">
        <ul>
          ${adulto}
          ${estudante}
          ${crianca}
        </ul>

        <div class="price-highlight">
          <div class="price-text">
            <span>Por apenas</span>
            <strong>R$ ${formatar(passeio.valor_final || 0)}</strong>
          </div>

          <button class="btn-comprar" type="button" data-id="${passeio.id}">
            Comprar
          </button>
        </div>
      </div>
    </div>
  `;

  const btnComprar = card.querySelector(".btn-comprar");
  if (btnComprar) {
    btnComprar.addEventListener("click", () => {
      window.location.href = `/paginas/Detalhes.html?id=${passeio.id}`;
    });
  }

  return card;
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatar(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}