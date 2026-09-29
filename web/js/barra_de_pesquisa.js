// ====== Carrega e injeta a barra de pesquisa ======
fetch('paginas/barra_de_pesquisa.html')
  .then(r => r.text())
  .then(html => {
    const container = document.getElementById('barra-pesquisa-container');
    container.innerHTML = html;

    // ====== Garante que o CSS está carregado ======
    const cssPath = '/css/barra_de_pesquisa.css';
    if (!document.querySelector(`link[href="${cssPath}"]`)) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = cssPath;
      document.head.appendChild(css);
    }

    // ====== Animação fade-in ======
    const barra = container.querySelector('.search-container');
    if (barra) {
      barra.classList.add('barra-fadein');
      requestAnimationFrame(() => barra.classList.add('show'));
    }

    console.log("✅ Barra de pesquisa IA carregada!");
    // ====== Botão Buscar ======
    const btnBuscar = container.querySelector('#btnAISearch');
    const aiInput = container.querySelector('#aiSearchInput');

    if (btnBuscar) {
      btnBuscar.addEventListener('click', () => {
        const query = aiInput?.value.trim();
        buscarPasseiosComIA(query);
      });
    }

    if (aiInput && btnBuscar) {
      aiInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          btnBuscar.click();
        }
      });
    }
  })
  .catch(err => console.error("❌ Erro ao carregar barra de pesquisa:", err));


function renderizarFlashcards(passeios) {
  const container = document.getElementById('flashcards-container');
  container.innerHTML = '<div class="cards-row" id="flashcards-row"></div>';
  const row = document.getElementById('flashcards-row');

  if (!Array.isArray(passeios) || passeios.length === 0) {
    row.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center">
          Nenhum passeio encontrado para essa região.
        </div>
      </div>
    `;
    return;
  }

  passeios.forEach(p => {
    row.innerHTML += criarFlashcard(p);
  });
}

function criarFlashcard(p) {
  return `
      <div class="card">
        <img 
          src="${p.imagem ? `${API_BASE}/uploads/${p.imagem}` : '/img/padrao.jpg'}"
          class="flashcard-img"
          alt="${p.local}">

        <div class="card-body">
          <h5 class="flashcard-title">${p.local}</h5>
          <p class="flashcard-text">${p.descricao}</p>

          <div class="card-prices">
            <ul>
              <li><i class="fa-solid fa-user"></i> Adultos: <strong>R$ ${p.valor_adulto ?? '-'}</strong></li>
              <li><i class="fa-solid fa-graduation-cap"></i> Estudantes: <strong>R$ ${p.valor_estudante ?? '-'}</strong></li>
              <li><i class="fa-solid fa-child"></i> Crianças: <strong>R$ ${p.valor_crianca ?? '-'}</strong></li>
            </ul>

          <div class="price-highlight">
            <div class="price-text">
              <span>Por apenas</span>
              <strong>R$ ${Number(p.valor_final).toFixed(2).replace('.', ',')}</strong>
            </div>
            <button class="btn-comprar" type="button" onclick="window.location.href='/paginas/detalhes.html?id=${p.id}'">Comprar</button>
          </div>
          </div>
        </div>
      </div>
  `;
}

function buscarPasseiosComIA(query) {
  let url = `${API_BASE}/api/passeios`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Erro na API');
      return res.json();
    })
    .then(passeios => {
      if (!Array.isArray(passeios)) {
        renderizarFlashcards([]);
        return;
      }

      if (!query) {
        renderizarFlashcards(passeios);
        return;
      }

      // Inteligência Artificial / Palavras-chave: Algoritmo de scoring
      const stopWords = new Set(['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'com', 'na', 'no', 'uma', 'os', 'as', 'dos', 'das', 'como', 'quero', 'passeio', 'passeios', 'viagem', 'turismo']);
      const queryTerms = query.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .split(/\s+/)
        .filter(t => t.length > 1 && !stopWords.has(t));

      if (queryTerms.length === 0) {
        queryTerms.push(query.toLowerCase());
      }

      const scoredPasseios = passeios.map(p => {
        let score = 0;
        const local = (p.local || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const desc = (p.descricao || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cat = (p.categoria || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cid = (p.cidade || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const est = (p.estado || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        queryTerms.forEach(term => {
          if (local.includes(term)) {
            score += 15;
            if (local.startsWith(term)) score += 5;
          }
          if (cat.includes(term)) {
            score += 12;
          }
          if (desc.includes(term)) {
            const occurrences = desc.split(term).length - 1;
            score += occurrences * 4;
          }
          if (cid.includes(term)) {
            score += 8;
          }
          if (est.includes(term)) {
            score += 5;
          }
        });

        return { passeio: p, score };
      });

      const resultados = scoredPasseios
        .filter(sp => sp.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(sp => sp.passeio);

      renderizarFlashcards(resultados);
    })
    .catch(err => {
      console.error(err);
      renderizarFlashcards([]);
    });
}



