// ===========================
// CONFIG
// ===========================
const API_URL = window.API_URL || 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const id = getPasseioIdFromURL();
  if (!id) {
    setText('passeioTitulo', 'Passeio não encontrado');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/passeios/${id}/detalhes`);
    if (!res.ok) throw new Error('Falha ao carregar detalhes');

    const data = await res.json();

    // suportar formatos diferentes
    const passeio = data.passeio || data;
    const imagens =
      data.imagens ||
      data.passeio_imagens ||
      passeio.imagens ||
      passeio.passeio_imagens ||
      [];

    preencherDetalhes(passeio, id);
    montarCarrossel(normalizarImagens(imagens), passeio.local);

    const btn = document.getElementById('btnComprar');
    if (btn) btn.addEventListener('click', () => comprarPasseio(passeio, id));

    const btnHistoria = document.getElementById('btnHistoria');
    if (btnHistoria) {
      btnHistoria.addEventListener('click', () => abrirModalHistoria(id, passeio.local));
    }

  } catch (err) {
    console.error(err);
    setText('passeioTitulo', 'Erro ao carregar passeio');
  }
}

// ===========================
// PREENCHER DADOS
// ===========================
function preencherDetalhes(p, passeioId) {
  setText('passeioTitulo', p.local || 'Passeio');

  setText('passeioCategoria', p.categoria ? `Categoria: ${capitalizar(p.categoria)}` : '');

  const cidadeEstado = joinParts([p.cidade, p.estado], ' / ');
  setText('passeioCidadeEstado', cidadeEstado ? `📍 ${cidadeEstado}` : '');

  setText('passeioDescricao', p.descricao || '');
  setText('passeioPreco', formatarMoeda(p.valor_final || 0));

  setOptionalTextBlock('blocoData', 'passeioData', formatarData(p.data_passeio));
  setOptionalTextBlock('blocoClassificacao', 'passeioClassificacao', toText(p.classificacao));
  setOptionalTextBlock('blocoFrequencia', 'passeioFrequencia', montarFrequencia(p.frequencia, p.horarios));

  renderRoteiro(p.roteiro);

  setOptionalListBlock('blocoInclusos', 'passeioInclusos', toList(p.inclui));
  setOptionalListBlock('blocoEmbarque', 'passeioEmbarque', toList(p.locais_embarque));
  setOptionalListBlock('blocoImportantes', 'passeioImportantes', toList(p.informacoes_importantes));

  montarAvaliacaoEstrelas({
    passeioId,
    media: p.avaliacao_media,      // opcional
    total: p.avaliacoes_total      // opcional
  });
}

// ===========================
// CARROSSEL (autoplay)
// ===========================
function montarCarrossel(imagens, titulo) {
  const wrapImgs = document.getElementById('carrosselImagens');
  const wrapDots = document.getElementById('carrosselIndicadores');
  const wrapThumbs = document.getElementById('carrosselThumbs');
  if (!wrapImgs || !wrapDots || !wrapThumbs) return;

  const lista = Array.isArray(imagens) && imagens.length ? imagens : ['default.jpg'];

  wrapImgs.innerHTML = '';
  wrapDots.innerHTML = '';
  wrapThumbs.innerHTML = '';

  let indexAtual = 0;
  let timer = null;

  lista.forEach((nome, idx) => {
    const src = `${API_URL}/uploads/${encodeURIComponent(nome)}`;

    const img = document.createElement('img');
    img.src = src;
    img.alt = `${titulo || 'Passeio'} - imagem ${idx + 1}`;
    img.className = idx === 0 ? 'carrossel-img ativa' : 'carrossel-img';
    img.dataset.index = String(idx);
    wrapImgs.appendChild(img);

    const dot = document.createElement('span');
    dot.className = idx === 0 ? 'dot ativa' : 'dot';
    dot.dataset.index = String(idx);
    dot.addEventListener('click', () => { ativar(idx); reiniciarAutoplay(); });
    wrapDots.appendChild(dot);

    const th = document.createElement('img');
    th.src = src;
    th.alt = `Miniatura ${idx + 1}`;
    th.className = idx === 0 ? 'thumb ativa' : 'thumb';
    th.dataset.index = String(idx);
    th.addEventListener('click', () => { ativar(idx); reiniciarAutoplay(); });
    wrapThumbs.appendChild(th);
  });

  function ativar(index) {
    indexAtual = index;

    wrapImgs.querySelectorAll('.carrossel-img').forEach(el => {
      el.classList.toggle('ativa', Number(el.dataset.index) === index);
    });
    wrapDots.querySelectorAll('.dot').forEach(el => {
      el.classList.toggle('ativa', Number(el.dataset.index) === index);
    });
    wrapThumbs.querySelectorAll('.thumb').forEach(el => {
      el.classList.toggle('ativa', Number(el.dataset.index) === index);
    });
  }

  function iniciarAutoplay() {
    if (lista.length <= 1) return;
    timer = setInterval(() => {
      ativar((indexAtual + 1) % lista.length);
    }, 4500);
  }

  function pararAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function reiniciarAutoplay() {
    pararAutoplay();
    iniciarAutoplay();
  }

  const area = wrapImgs.closest('.carrossel-area');
  if (area) {
    area.addEventListener('mouseenter', pararAutoplay);
    area.addEventListener('mouseleave', iniciarAutoplay);
  }

  iniciarAutoplay();
}

function normalizarImagens(imagens) {
  if (!Array.isArray(imagens)) return [];
  return imagens
    .map(it => (typeof it === 'string' ? it : (it.caminho || it.nome || '')))
    .filter(Boolean);
}

// ===========================
// AVALIAÇÃO (estrelas)
// ===========================
function montarAvaliacaoEstrelas({ passeioId, media, total }) {
  const area = document.getElementById('avaliacaoArea');
  const wrap = document.getElementById('avaliacaoEstrelas');
  const texto = document.getElementById('avaliacaoTexto');
  if (!area || !wrap || !texto) return;

  area.style.display = 'flex';

  const key = `rating_${passeioId}`;
  const minhaNota = Number(localStorage.getItem(key) || 0);

  const mediaNum = Number(media || 0);
  const totalNum = Number(total || 0);

  // mostra estrelas preenchidas por: minha nota > média > 0
  const valorInicial = minhaNota || Math.round(mediaNum) || 0;
  renderStars(valorInicial);

  if (totalNum > 0) {
    texto.textContent = `${mediaNum.toFixed(1).replace('.', ',')} (${totalNum} avaliações)`;
  } else {
    texto.textContent = minhaNota ? 'Sua avaliação salva' : 'Avalie este passeio';
  }

  function renderStars(valor) {
    wrap.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      star.className = i <= valor ? 'fa-solid fa-star' : 'fa-regular fa-star';

      star.addEventListener('mouseenter', () => pintar(i));
      star.addEventListener('mouseleave', () => pintar(Number(localStorage.getItem(key) || valorInicial)));

      star.addEventListener('click', async () => {
        localStorage.setItem(key, String(i));
        pintar(i);
        texto.textContent = 'Sua avaliação salva';

        // opcional: enviar pro backend se existir rota
        try {
          await fetch(`${API_URL}/passeios/${passeioId}/avaliacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nota: i })
          });
        } catch (_) {}
      });

      wrap.appendChild(star);
    }
  }

  function pintar(valor) {
    wrap.querySelectorAll('i').forEach((el, idx) => {
      const i = idx + 1;
      el.className = i <= valor ? 'fa-solid fa-star' : 'fa-regular fa-star';
    });
  }
}

// ===========================
// BLOCO: ROTEIRO (corrigido)
// ===========================
function renderRoteiro(roteiro) {
  const bloco = document.getElementById('blocoRoteiro');
  const ul = document.getElementById('passeioRoteiro');
  if (!bloco || !ul) return;

  // Se não veio nada, esconde
  if (!roteiro) {
    bloco.style.display = 'none';
    return;
  }

  // Se veio string JSON, tenta parsear
  let r = roteiro;
  if (typeof r === 'string') {
    const s = r.trim();
    if (!s) {
      bloco.style.display = 'none';
      return;
    }
    try { r = JSON.parse(s); } catch (_) {}
  }

  // Agora esperamos um OBJETO {saida, paradas, retorno} ou algo parecido
  const itens = [];

  // helpers
  const temTexto = (v) => v !== null && v !== undefined && String(v).trim() !== '';
  const linha = (titulo, obj) => {
    if (!obj || typeof obj !== 'object') return;
    const hora = temTexto(obj.hora) ? String(obj.hora).trim() : '';
    const local = temTexto(obj.local) ? String(obj.local).trim() : '';
    if (!hora && !local) return; // nada preenchido => não adiciona
    itens.push(`${titulo}: ${[hora, local].filter(Boolean).join(' — ')}`);
  };

  // Saída
  linha('Saída', r.saida);

  // Paradas (array)
  if (Array.isArray(r.paradas) && r.paradas.length) {
    r.paradas.forEach((p, idx) => {
      if (!p || typeof p !== 'object') return;
      const hora = temTexto(p.hora) ? String(p.hora).trim() : '';
      const local = temTexto(p.local) ? String(p.local).trim() : '';
      if (!hora && !local) return;
      itens.push(`Parada ${idx + 1}: ${[hora, local].filter(Boolean).join(' — ')}`);
    });
  }

  // Retorno
  linha('Retorno', r.retorno);

  // Se NÃO tem nenhum item útil, esconde (como era antes)
  if (!itens.length) {
    bloco.style.display = 'none';
    ul.innerHTML = '';
    return;
  }

  // Mostra e renderiza
  ul.innerHTML = '';
  itens.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    ul.appendChild(li);
  });

  bloco.style.display = 'block';
}


// ===========================
// COMPRAR (exemplo)
// ===========================
function comprarPasseio(p, id) {
  const CART_KEY = "matrip_cart";

  const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const existing = cart.find(it => String(it.id) === String(id));

  const primeiraImagemNome = Array.isArray(p.imagens) && p.imagens.length ? p.imagens[0] : null;

  const item = {
    id: String(id),
    titulo: p.local || "Passeio",
    subtitulo: p.categoria ? `Categoria: ${capitalizar(p.categoria)}` : "",
    preco: Number(p.valor_final || 0),
    imagem: primeiraImagemNome
      ? `${API_URL}/uploads/${encodeURIComponent(primeiraImagemNome)}`
      : "/img/placeholder.jpg",
    detalhesUrl: `/paginas/Detalhes.html?id=${encodeURIComponent(id)}`,
    quantidade: 1
  };

  if (existing) {
    existing.quantidade = Number(existing.quantidade || 1) + 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.location.href = "/paginas/carrinho.html";
}


// ===========================
// HELPERS
// ===========================
function getPasseioIdFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get('id');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

function setOptionalTextBlock(blocoId, textoId, valor) {
  const bloco = document.getElementById(blocoId);
  const el = document.getElementById(textoId);
  if (!bloco || !el) return;

  const text = toText(valor);
  if (!text) {
    bloco.style.display = 'none';
    return;
  }

  el.textContent = text;
  bloco.style.display = 'block';
}

function setOptionalListBlock(blocoId, ulId, lista) {
  const bloco = document.getElementById(blocoId);
  const ul = document.getElementById(ulId);
  if (!bloco || !ul) return;

  const arr = Array.isArray(lista) ? lista : toList(lista);
  if (!arr.length) {
    bloco.style.display = 'none';
    return;
  }

  ul.innerHTML = '';
  arr.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });

  bloco.style.display = 'block';
}

function toText(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number') return String(v);
  return String(v).trim();
}

/**
 * toList CORRIGIDO:
 * - se vier array de objetos (roteiro JSON), formata em texto
 * - se vier objeto, tenta formatar também
 * - se vier string JSON, faz parse
 */
function toList(v) {
  if (v === null || v === undefined) return [];

  if (Array.isArray(v)) {
    return v.map(formatItem).filter(Boolean);
  }

  if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return [];

    // tenta parsear JSON
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
      try {
        return toList(JSON.parse(s));
      } catch (_) {}
    }

    if (s.includes('\n')) return s.split('\n').map(x => x.trim()).filter(Boolean);
    if (s.includes(';')) return s.split(';').map(x => x.trim()).filter(Boolean);

    return [s];
  }

  if (typeof v === 'object') {
    // objeto único -> vira 1 item formatado
    return [formatItem(v)].filter(Boolean);
  }

  return [String(v).trim()].filter(Boolean);
}

function formatItem(item) {
  if (item === null || item === undefined) return '';

  if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
    return String(item).trim();
  }

  if (typeof item === 'object') {
    // tenta montar algo “bonito” com chaves comuns
    const keysPreferidas = ['titulo', 'nome', 'etapa', 'descricao', 'local', 'hora', 'horario', 'inicio', 'fim'];
    const partes = [];

    keysPreferidas.forEach(k => {
      if (item[k] !== undefined && item[k] !== null && String(item[k]).trim() !== '') {
        partes.push(String(item[k]).trim());
      }
    });

    if (partes.length) return partes.join(' — ');

    // fallback: JSON compacto
    try {
      return JSON.stringify(item);
    } catch (_) {
      return String(item);
    }
  }

  return String(item).trim();
}

function montarFrequencia(frequencia, horarios) {
  const f = toText(frequencia);
  const hs = toList(horarios);
  const hText = hs.length ? `Horários: ${hs.join(', ')}` : '';
  return joinParts([f, hText], ' • ');
}

function formatarMoeda(valor) {
  const num = Number(valor || 0);
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarData(dateValue) {
  const s = toText(dateValue);
  if (!s) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('pt-BR');
  }

  const dt = new Date(s);
  if (!isNaN(dt.getTime())) return dt.toLocaleDateString('pt-BR');

  return s;
}

function capitalizar(str) {
  const s = toText(str);
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function joinParts(parts, sep) {
  return parts.map(toText).filter(Boolean).join(sep);
}

function alinharCardReservaNoMeio() {
  const carrossel = document.querySelector('.carrossel-area');
  const wrap = document.querySelector('.reserva-wrap');
  const card = document.querySelector('.card-reserva');
  if (!carrossel || !wrap || !card) return;

  // no mobile não centraliza (fica normal)
  if (window.innerWidth < 992) {
    wrap.style.height = 'auto';
    card.style.marginTop = '0';
    return;
  }

  const carH = carrossel.getBoundingClientRect().height;
  wrap.style.height = `${carH}px`;

  const cardH = card.getBoundingClientRect().height;
  const mt = Math.max(0, (carH - cardH) / 2);

  card.style.marginTop = `${mt}px`;
}

// chama depois de montar o carrossel e depois que tudo renderizar
function prepararAlinhamentoCard() {
  requestAnimationFrame(() => {
    alinharCardReservaNoMeio();
    // garante após imagens carregarem
    setTimeout(alinharCardReservaNoMeio, 150);
    setTimeout(alinharCardReservaNoMeio, 400);
  });

  window.addEventListener('resize', alinharCardReservaNoMeio);
  window.addEventListener('load', alinharCardReservaNoMeio);
}
function alinharReservaComCarrossel() {
  const header = document.getElementById('passeioHeader');
  const car = document.querySelector('.carrossel-imagens'); // pega só a área da imagem
  const wrap = document.querySelector('.reserva-wrap');
  const card = document.querySelector('.card-reserva');

  if (!wrap || !card || !car) return;

  // mobile: comportamento normal
  if (window.innerWidth < 992) {
    wrap.style.marginTop = '0';
    wrap.style.height = 'auto';
    return;
  }

  // 1) empurra a coluna direita para começar na MESMA altura do carrossel
  const headerH = header ? header.getBoundingClientRect().height : 0;
  wrap.style.marginTop = `${headerH}px`;

  // 2) faz o wrapper ter a mesma altura do carrossel para centralizar no meio
  const carH = car.getBoundingClientRect().height;
  wrap.style.height = `${carH}px`;

  // flex já centraliza o card (CSS), mas garantimos:
  card.style.marginTop = '0';
}

function prepararAlinhamentoReserva() {
  // roda algumas vezes pra pegar quando imagens carregarem
  requestAnimationFrame(alinharReservaComCarrossel);
  setTimeout(alinharReservaComCarrossel, 150);
  setTimeout(alinharReservaComCarrossel, 400);

  window.addEventListener('resize', alinharReservaComCarrossel);
  window.addEventListener('load', alinharReservaComCarrossel);
}
prepararAlinhamentoReserva();

async function abrirModalHistoria(passeioId, passeioLocal) {
  const modalEl = document.getElementById('modalHistoria');
  if (!modalEl) return;
  
  const labelEl = document.getElementById('modalHistoriaLabel');
  if (labelEl) {
    labelEl.textContent = `História do Passeio: ${passeioLocal || 'Passeio'}`;
  }

  const modal = new bootstrap.Modal(modalEl);
  const conteudo = document.getElementById('conteudoHistoria');
  if (!conteudo) return;

  conteudo.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
  `;

  modal.show();

  try {
    const res = await fetch(`${API_URL}/passeios/${passeioId}/historias`);
    if (!res.ok) throw new Error('Não foi possível obter a história deste passeio.');

    const dados = await res.json();
    let html = '';

    if (dados.contexto_historico) {
      html += `
        <div class="caixa-atracao shadow-sm mb-4">
          <h5 class="fw-bold mb-2"><i class="fa-solid fa-landmark me-2" style="color: #00bfa6;"></i>Contexto Histórico</h5>
          <p class="mb-0 text-secondary" style="font-style: italic; white-space: pre-line;">${escapeHtml(dados.contexto_historico)}</p>
        </div>
      `;
    }

    if (dados.atracoes && dados.atracoes.length > 0) {
      html += `<h5 class="fw-bold mb-3 mt-4" style="color: #003543;"><i class="fa-solid fa-route me-2" style="color: #00bfa6;"></i>História das Atrações (Roteiro de Visitação)</h5>`;
      html += `<div class="timeline ps-2">`;

      dados.atracoes.forEach(atracao => {
        const obsHtml = atracao.observacao
          ? `<p class="small text-muted mt-2 mb-0"><strong>Observação:</strong> ${escapeHtml(atracao.observacao)}</p>`
          : '';

        const curiosidadeHtml = atracao.curiosidades
          ? `
            <div class="caixa-curiosidade shadow-sm">
              <small class="fw-bold"><i class="fa-solid fa-lightbulb me-1"></i> Você sabia?</small>
              <p class="small text-secondary mb-0 mt-1" style="white-space: pre-line;">${escapeHtml(atracao.curiosidades)}</p>
            </div>
          `
          : '';

        const localidadeHtml = atracao.localidade_historia
          ? `
            <div class="caixa-localidade shadow-sm">
              <small class="fw-bold"><i class="fa-solid fa-map-location-dot me-1"></i> História da Localidade (${escapeHtml(atracao.localidade_nome)})</small>
              <p class="small text-secondary mb-0 mt-1" style="white-space: pre-line;">${escapeHtml(atracao.localidade_historia)}</p>
              ${atracao.localidade_curiosidades ? `
                <hr class="my-2 opacity-25" style="border-color: #15803d;">
                <small class="fw-bold"><i class="fa-solid fa-face-smile me-1"></i> Curiosidades da Localidade</small>
                <p class="small text-secondary mb-0 mt-1" style="white-space: pre-line;">${escapeHtml(atracao.localidade_curiosidades)}</p>
              ` : ''}
            </div>
          `
          : '';

        html += `
          <div class="timeline-item mb-4 pb-4 border-bottom">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="fw-bold text-dark mb-0" style="font-size: 1.1rem;">
                <span class="badge badge-parada me-2">${atracao.ordem_visita}° Parada</span>
                ${escapeHtml(atracao.nome)}
                <span class="badge badge-tipo ms-1 fw-normal text-capitalize fs-6" style="font-size: 0.8rem !important;">${escapeHtml(atracao.tipo || 'atração')}</span>
              </h5>
            </div>

            <p class="text-secondary mb-3 small" style="white-space: pre-line;">${escapeHtml(atracao.descricao || '')}</p>

            ${atracao.historia ? `
              <div class="caixa-atracao shadow-sm mb-2">
                <h6 class="fw-bold mb-1" style="font-size: 0.9rem;">História da Atração</h6>
                <p class="mb-0 text-secondary-emphasis small" style="white-space: pre-line;">${escapeHtml(atracao.historia)}</p>
              </div>
            ` : ''}

            ${curiosidadeHtml}
            ${localidadeHtml}
            ${obsHtml}
          </div>
        `;
      });

      html += `</div>`;
    } else {
      if (!dados.contexto_historico) {
        html += `<p class="text-muted text-center my-4">Nenhuma história ou atração histórica cadastrada para este passeio.</p>`;
      }
    }

    conteudo.innerHTML = html;
  } catch (err) {
    console.error(err);
    conteudo.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        <i class="fa-solid fa-triangle-exclamation me-2"></i> ${err.message || 'Erro ao carregar histórias.'}
      </div>
    `;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

