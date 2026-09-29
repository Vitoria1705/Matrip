const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Preencha todos os campos");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.error || "Erro ao fazer login");
      return;
    }

    // salva dados do usuário
    localStorage.setItem("usuario", JSON.stringify(dados));
    localStorage.setItem("tipo", dados.tipo);









    // 🔁 REDIRECT APÓS LOGIN (corrigido)
    // 🔁 REDIRECIONAMENTO POR TIPO DE USUÁRIO
    // Temporariamente, usuários do tipo "guia" acessarão o dashboard do parceiro.
    // Isso será revisado caso o professor aprove um tipo específico "parceiro" no banco.
const redirect = localStorage.getItem("redirectAfterLogin");

if (redirect) {
  localStorage.removeItem("redirectAfterLogin");
  window.location.href = redirect;
} else {

  const tipo = (dados.tipo || "").toLowerCase();

  if (tipo === "admin") {
    window.location.href = "/paginas/admin/index.html";
    return;
  }

  // TEMPORÁRIO: guia acessa painel parceiro
  if (tipo === "parceiro") {
    window.location.href = "/paginas/parceiro/index.html";
    return;
  }




  if (tipo === "guia") {
  window.location.href = "/paginas/guia/index.html";
  return;
}







  // usuário comum (turista)
  window.location.href = "/index.html";
}









  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com o servidor");
  }
});
// ==============================
// LOGIN COM GOOGLE (real)
// ==============================
const GOOGLE_CLIENT_ID = "539756979388-6mlps18ki0npk7e17ushdc589pbkqsdh.apps.googleusercontent.com";

function redirecionarPorTipo(dados) {
  const redirect = localStorage.getItem("redirectAfterLogin");
  if (redirect) {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirect;
    return;
  }
  const tipo = (dados.tipo || "").toLowerCase();
  if (tipo === "admin") window.location.href = "/paginas/admin/index.html";
  else if (tipo === "parceiro") window.location.href = "/paginas/parceiro/index.html";
  else if (tipo === "guia") window.location.href = "/paginas/guia/index.html";
  else window.location.href = "/index.html";
}

function iniciarGoogle() {
  const alvo = document.getElementById("googleLoginBtn");
  if (!alvo || !window.google) return false;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: async (resp) => {
      try {
        const r = await fetch("http://localhost:3000/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: resp.credential }),
        });
        const dados = await r.json();
        if (!r.ok) {
          alert(dados.error || "Não foi possível entrar com o Google.");
          return;
        }
        localStorage.setItem("usuario", JSON.stringify(dados));
        localStorage.setItem("tipo", dados.tipo);
        redirecionarPorTipo(dados);
      } catch (e) {
        console.error(e);
        alert("Erro ao conectar com o servidor");
      }
    },
  });

  google.accounts.id.renderButton(alvo, {
    theme: "outline",
    size: "large",
    text: "signin_with",
    width: 320,
  });
  return true;
}

const tentativaGoogle = setInterval(() => {
  if (iniciarGoogle()) clearInterval(tentativaGoogle);
}, 300);
