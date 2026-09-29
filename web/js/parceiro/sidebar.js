document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarClose = document.getElementById("sidebarClose");

  function abrirSidebar() {
    if (sidebar) {
      sidebar.classList.add("open");
    }
  }

  function fecharSidebar() {
    if (sidebar) {
      sidebar.classList.remove("open");
    }
  }

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      abrirSidebar();
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener("click", () => {
      fecharSidebar();
    });
  }

  // fecha a sidebar ao clicar fora, apenas no mobile
  document.addEventListener("click", (event) => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile || !sidebar) return;

    const clicouDentroDaSidebar = sidebar.contains(event.target);
    const clicouNoBotaoMenu = menuToggle && menuToggle.contains(event.target);

    if (!clicouDentroDaSidebar && !clicouNoBotaoMenu) {
      fecharSidebar();
    }
  });

  // fecha a sidebar ao trocar para desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      fecharSidebar();
    }
  });

  // logout centralizado para qualquer botão com classe .logout-btn
  document.addEventListener("click", (event) => {
    const btnSair = event.target.closest(".logout-btn");
    if (!btnSair) return;

    event.preventDefault();

    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("redirectAfterLogin");

    // volta para a home pública do projeto
    window.location.href = "../../index.html";
  });
});