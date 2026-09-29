const saveProfileBtn = document.getElementById("saveProfileBtn");
const messageBox = document.getElementById("messageBox");
const logoutBtn = document.getElementById("logoutBtn");

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const tipoInput = document.getElementById("tipo");
const usuarioIdInput = document.getElementById("usuarioId");
const celularInput = document.getElementById("celular");
const meiInput = document.getElementById("mei");
const bioInput = document.getElementById("bio");

const profileAvatar = document.getElementById("profileAvatar");
const profileDisplayName = document.getElementById("profileDisplayName");
const profileDisplayEmail = document.getElementById("profileDisplayEmail");
const profileTipoBadge = document.getElementById("profileTipoBadge");
const sidebarGuideEmail = document.getElementById("sidebarGuideEmail");

const summaryNome = document.getElementById("summaryNome");
const summaryEmail = document.getElementById("summaryEmail");
const summaryTipo = document.getElementById("summaryTipo");
const summaryId = document.getElementById("summaryId");
const summaryCelular = document.getElementById("summaryCelular");
const summaryMei = document.getElementById("summaryMei");

function showMessage(type, text) {
  messageBox.className = `message-box ${type}`;
  messageBox.textContent = text;
}

function clearMessage() {
  messageBox.className = "message-box hidden";
  messageBox.textContent = "";
}

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

function getStoredGuideExtra(userId) {
  const raw = localStorage.getItem(`guide_profile_extra_${userId}`);
  if (!raw) return { celular: "", mei: "", bio: "" };

  try {
    return JSON.parse(raw);
  } catch {
    return { celular: "", mei: "", bio: "" };
  }
}

function setStoredGuideExtra(userId, value) {
  localStorage.setItem(`guide_profile_extra_${userId}`, JSON.stringify(value));
}

function getInitial(name) {
  if (!name || !name.trim()) return "G";
  return name.trim().charAt(0).toUpperCase();
}

function fillProfile(user) {
  const extra = getStoredGuideExtra(user.id);

  nomeInput.value = user.nome || "";
  emailInput.value = user.email || "";
  tipoInput.value = user.tipo || "guia";
  usuarioIdInput.value = user.id || "";
  celularInput.value = extra.celular || "";
  meiInput.value = extra.mei || "";
  bioInput.value = extra.bio || "";

  profileAvatar.textContent = getInitial(user.nome);
  profileDisplayName.textContent = user.nome || "Guia";
  profileDisplayEmail.textContent = user.email || "--";
  profileTipoBadge.textContent = user.tipo || "guia";
  sidebarGuideEmail.textContent = user.email || "--";

  summaryNome.textContent = user.nome || "--";
  summaryEmail.textContent = user.email || "--";
  summaryTipo.textContent = user.tipo || "--";
  summaryId.textContent = user.id || "--";
  summaryCelular.textContent = extra.celular || "--";
  summaryMei.textContent = extra.mei || "--";
}

function saveProfileLocally() {
  clearMessage();

  const user = getStoredUser();

  if (!user) {
    showMessage("error", "Usuário não encontrado no armazenamento local.");
    return;
  }

  const updatedUser = {
    ...user,
    nome: nomeInput.value.trim(),
    email: emailInput.value.trim()
  };

  if (!updatedUser.nome || !updatedUser.email) {
    showMessage("error", "Preencha nome e e-mail.");
    return;
  }

  localStorage.setItem("usuario", JSON.stringify(updatedUser));

  setStoredGuideExtra(updatedUser.id, {
    celular: celularInput.value.trim(),
    mei: meiInput.value.trim(),
    bio: bioInput.value.trim()
  });

  fillProfile(updatedUser);
  showMessage("success", "Perfil do guia atualizado localmente com sucesso.");
}

function logout() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("tipo");
  window.location.href = "/index.html";
}

window.addEventListener("DOMContentLoaded", () => {
  clearMessage();

  const user = getStoredUser();

  if (!user) {
    showMessage("error", "Nenhum usuário logado foi encontrado.");
    return;
  }

  fillProfile(user);
});

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", saveProfileLocally);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}