// ==============================
// 🚀 INJEÇÃO DE COMPONENTES
// ==============================
function carregarComponente(seletor, caminho) {
  const elemento = document.querySelector(seletor);
  if (!elemento) return Promise.resolve();

  return fetch(caminho)
    .then((res) => {
      if (!res.ok) throw new Error(`Erro ao carregar ${caminho}`);
      return res.text();
    })
    .then(async (html) => {
      elemento.innerHTML = html;

      if (seletor === "#carrossel-container") {
        if (window.initCarrosselDinamico) {
          return window.initCarrosselDinamico().then(() => {
            inicializarCarrossel();
          });
        } else {
          inicializarCarrossel();
        }
      }

      if (seletor === "#flashcards-container") {
        // depois que o HTML parcial dos flashcards entra na página,
        // chama a função que busca os passeios e monta os cards
        if (typeof carregarFlashcards === "function") {
          await carregarFlashcards();
        }

        ativarScrollReveal();
      }
    })
    .catch((err) => console.error(err));
}

// ==============================
// ⚙️ CARREGAMENTO INICIAL
// ==============================
document.addEventListener("DOMContentLoaded", async () => {
  await carregarComponente("#navbar-container", "/navbar.html");
  await carregarComponente("#carrossel-container", "/paginas/carrossel.html");
  await carregarComponente("#flashcards-container", "/paginas/flashcards.html");
  await carregarComponente("#footer-container", "/footer.html");

  ativarRevealParceiros();
  configurarBotaoTopo();
  pausarCarrosselParceiros();
  configurarBotoesVerMais();
  atualizarEstadoNavbar();
});

// ==============================
// 🧭 CONTROLE DE SCROLL
// ==============================
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => window.scrollTo(0, 0));

// ==============================
// 🎠 INICIALIZAÇÃO DO CARROSSEL BOOTSTRAP
// ==============================
function inicializarCarrossel() {
  const myCarousel = document.querySelector("#carouselExampleCaptions");
  if (!myCarousel || typeof bootstrap === "undefined") return;

  new bootstrap.Carousel(myCarousel, {
    interval: 5000,
    ride: "carousel",
    pause: false
  });
}

// ==============================
// 🌟 ANIMAÇÃO AO ROLAR
// ==============================
function ativarScrollReveal() {
  const cards = document.querySelectorAll(".card");
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach((card) => observer.observe(card));
}

// ==============================
// ⬆️ BOTÃO "VOLTAR AO TOPO"
// ==============================
function configurarBotaoTopo() {
  const btnTopo = document.getElementById("btn-topo");
  if (!btnTopo) return;

  window.addEventListener("scroll", () => {
    btnTopo.classList.toggle("show", window.scrollY > 400);
  });

  btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==============================
// 🤝 REVEAL DOS PARCEIROS
// ==============================
function ativarRevealParceiros() {
  const elementos = document.querySelectorAll(".reveal");
  if (!elementos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elementos.forEach((el) => observer.observe(el));
}

// ==============================
// 🤝 CARROSSEL DE PARCEIROS
// ==============================
function pausarCarrosselParceiros() {
  const carousel = document.querySelector(".carousel-logos");
  if (!carousel) return;

  carousel.addEventListener("mouseenter", () => {
    carousel.style.animationPlayState = "paused";
  });

  carousel.addEventListener("mouseleave", () => {
    carousel.style.animationPlayState = "running";
  });
}

// ==============================
// 🎴 BOTÕES "VER MAIS / VER MENOS / VER TUDO"
// ==============================
function configurarBotoesVerMais() {
  document.body.addEventListener("click", (e) => {
    const btn = e.target;

    if (btn.classList.contains("btn-vermais")) {
      const categoria = btn.closest(".categoria");
      const extras = categoria?.querySelector(".extras");
      if (!extras) return;

      extras.classList.toggle("show");

      if (extras.classList.contains("show")) {
        btn.style.display = "none";

        const actions = document.createElement("div");
        actions.classList.add("btn-actions");

        const btnMenos = document.createElement("button");
        btnMenos.className = "btn-vermenos";
        btnMenos.textContent = "Ver menos";

        const btnTudo = document.createElement("button");
        btnTudo.className = "btn-vertudo";
        btnTudo.textContent = "Ver tudo";

        actions.append(btnMenos, btnTudo);
        categoria.append(actions);

        extras.querySelectorAll(".card").forEach((card, i) => {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";

          setTimeout(() => {
            card.style.transition = "opacity .4s ease, transform .4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, i * 60);
        });
      }
    }

    if (btn.classList.contains("btn-vermenos")) {
      const categoria = btn.closest(".categoria");
      const extras = categoria?.querySelector(".extras");
      const btnVerMais = categoria?.querySelector(".btn-vermais");

      categoria?.querySelector(".btn-actions")?.remove();
      extras?.classList.remove("show");

      if (btnVerMais) btnVerMais.style.display = "inline-block";
    }

    if (btn.classList.contains("btn-vertudo")) {
      document.querySelectorAll(".categoria .extras").forEach((ex) => {
        ex.classList.add("show");

        ex.querySelectorAll(".card").forEach((card, i) => {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";

          setTimeout(() => {
            card.style.transition = "opacity .4s ease, transform .4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, i * 50);
        });
      });

      document.querySelectorAll(".btn-actions").forEach((a) => a.remove());
      document.querySelectorAll(".btn-vermais").forEach((b) => {
        b.style.display = "none";
      });
    }
  });
}

// ==============================
// 🔐 NAVBAR / LOGIN / LOGOUT
// ==============================
function atualizarEstadoNavbar() {
  const usuario = localStorage.getItem("usuario");
  const btnMinhaConta = document.querySelector("#btnMinhaConta");
  const span = document.querySelector("#btnMinhaConta span");

  if (span) {
    span.textContent = "Minha Conta";
  }

  if (usuario && btnMinhaConta) {
    btnMinhaConta.classList.add("logged");
  }
}

document.addEventListener("click", function (e) {
  const logoutBtn = e.target.closest("#logoutBtn, .logout-btn");

  if (logoutBtn) {
    e.preventDefault();
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = "/paginas/login1.html";
    return;
  }

  const btn = e.target.closest("#btnMinhaConta");
  if (!btn) return;

  e.preventDefault();

  const usuario = localStorage.getItem("usuario");
  const tipo = (localStorage.getItem("tipo") || "").toLowerCase();

  if (!usuario || !tipo) {
    window.location.href = "/paginas/login1.html";
    return;
  }

  if (tipo === "admin") {
    window.location.href = "/paginas/admin/index.html";
    return;
  }

  if (tipo === "parceiro") {
    window.location.href = "/paginas/parceiro/index.html";
    return;
  }

  if (tipo === "guia") {
  window.location.href = "/paginas/guia/index.html";
  return;
  }

  if (tipo === "usuario") {
    window.location.href = "/paginas/cliente/index.html";
    return;
  }

  window.location.href = "/paginas/login1.html";
});