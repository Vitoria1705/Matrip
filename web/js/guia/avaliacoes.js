const avaliacoesList = document.getElementById("avaliacoesList");
const metricNotaMedia = document.getElementById("metricNotaMedia");
const metricTotalFeedbacks = document.getElementById("metricTotalFeedbacks");
const metricElogios = document.getElementById("metricElogios");
const metricPasseiosAvaliados = document.getElementById("metricPasseiosAvaliados");
const sidebarGuideEmail = document.getElementById("sidebarGuideEmail");

function getStoredUser() {
  const raw = localStorage.getItem("usuario");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return JSON.parse(parsed);
    return parsed;
  } catch {
    return null;
  }
}

function getMockAvaliacoes(user) {
  return [
    {
      passeio: "Centro Histórico",
      nota: 5,
      comentario: "Guia muito atencioso, explicou bem o roteiro e foi pontual.",
      autor: "Turista Matrip"
    },
    {
      passeio: "City Tour Panorâmico",
      nota: 5,
      comentario: "Experiência excelente. Comunicação clara e passeio organizado.",
      autor: "Visitante"
    },
    {
      passeio: "Rota Gastronômica",
      nota: 4,
      comentario: "Muito bom atendimento e ótimo domínio do trajeto.",
      autor: user?.nome || "Cliente"
    }
  ];
}

function renderAvaliacoes(avaliacoes) {
  avaliacoesList.innerHTML = "";

  if (!avaliacoes.length) {
    avaliacoesList.innerHTML = `
      <div class="avaliacao-item">
        <div class="avaliacao-header">
          <strong>Nenhum feedback ainda</strong>
          <span class="avaliacao-stars">☆☆☆☆☆</span>
        </div>
        <p>Quando houver avaliações reais, elas podem ser exibidas aqui.</p>
        <span>Matrip</span>
      </div>
    `;
    return;
  }

  avaliacoes.forEach((item) => {
    const stars = "★".repeat(item.nota) + "☆".repeat(5 - item.nota);

    const card = document.createElement("div");
    card.className = "avaliacao-item";
    card.innerHTML = `
      <div class="avaliacao-header">
        <strong>${item.passeio}</strong>
        <span class="avaliacao-stars">${stars}</span>
      </div>
      <p>${item.comentario}</p>
      <span>${item.autor}</span>
    `;
    avaliacoesList.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const user = getStoredUser();

  if (!user) {
    window.location.href = "/paginas/login1.html";
    return;
  }

  sidebarGuideEmail.textContent = user.email || "--";

  const avaliacoes = getMockAvaliacoes(user);
  const total = avaliacoes.length;
  const soma = avaliacoes.reduce((acc, item) => acc + item.nota, 0);
  const media = total ? (soma / total).toFixed(1).replace(".", ",") : "0,0";
  const elogios = avaliacoes.filter(item => item.nota >= 4).length;
  const passeiosAvaliados = new Set(avaliacoes.map(item => item.passeio)).size;

  metricNotaMedia.textContent = media;
  metricTotalFeedbacks.textContent = total;
  metricElogios.textContent = elogios;
  metricPasseiosAvaliados.textContent = passeiosAvaliados;

  renderAvaliacoes(avaliacoes);
});