// Popup de la extensión — fase 1: autenticación OTP.
// El minuteur + contexte se añaden en la siguiente fase.
import { sendOtp, verifyOtp, getSession, signOut, resolveAppUser } from "./core/auth.js";

const els = {
  authView: document.querySelector("#auth-view"),
  appView: document.querySelector("#app-view"),
  emailStep: document.querySelector("#email-step"),
  codeStep: document.querySelector("#code-step"),
  email: document.querySelector("#email-input"),
  code: document.querySelector("#code-input"),
  sendBtn: document.querySelector("#send-code-btn"),
  verifyBtn: document.querySelector("#verify-code-btn"),
  backBtn: document.querySelector("#back-btn"),
  signoutBtn: document.querySelector("#signout-btn"),
  status: document.querySelector("#auth-status"),
  userPill: document.querySelector("#user-pill"),
};

let pendingEmail = "";

function setStatus(message, tone = "info") {
  if (!message) {
    els.status.hidden = true;
    els.status.textContent = "";
    return;
  }
  els.status.hidden = false;
  els.status.className = `status status--${tone}`;
  els.status.textContent = message;
}

function showAuthEmailStep() {
  els.authView.hidden = false;
  els.appView.hidden = true;
  els.emailStep.hidden = false;
  els.codeStep.hidden = true;
  els.userPill.hidden = true;
  setStatus("");
}

function showAuthCodeStep() {
  els.emailStep.hidden = true;
  els.codeStep.hidden = false;
  requestAnimationFrame(() => els.code.focus());
}

async function showAppView(session) {
  els.authView.hidden = true;
  els.appView.hidden = false;
  const appUser = await resolveAppUser(session);
  const name = appUser?.user_name || session.user?.email || "Connecté";
  els.userPill.hidden = false;
  els.userPill.textContent = appUser?.role ? `${name} · ${appUser.role}` : name;
}

async function handleSendCode() {
  const email = els.email.value.trim();
  if (!email) {
    setStatus("Renseigne ton email.", "error");
    return;
  }
  els.sendBtn.disabled = true;
  setStatus("Envoi du code…", "info");
  try {
    await sendOtp(email);
    pendingEmail = email;
    setStatus("Code envoyé. Vérifie ta boîte mail.", "ok");
    showAuthCodeStep();
  } catch (error) {
    setStatus(`Échec : ${error?.message || "réessaie"}`, "error");
  } finally {
    els.sendBtn.disabled = false;
  }
}

async function handleVerifyCode() {
  const token = els.code.value.trim();
  if (!token) {
    setStatus("Entre le code reçu.", "error");
    return;
  }
  els.verifyBtn.disabled = true;
  setStatus("Vérification…", "info");
  try {
    const { session } = await verifyOtp(pendingEmail, token);
    if (!session) {
      setStatus("Code invalide ou expiré.", "error");
      return;
    }
    await showAppView(session);
  } catch (error) {
    setStatus(`Échec : ${error?.message || "code invalide"}`, "error");
  } finally {
    els.verifyBtn.disabled = false;
  }
}

async function handleSignOut() {
  await signOut();
  els.email.value = "";
  els.code.value = "";
  pendingEmail = "";
  showAuthEmailStep();
}

els.sendBtn.addEventListener("click", () => void handleSendCode());
els.verifyBtn.addEventListener("click", () => void handleVerifyCode());
els.backBtn.addEventListener("click", () => showAuthEmailStep());
els.signoutBtn.addEventListener("click", () => void handleSignOut());
els.email.addEventListener("keydown", (e) => { if (e.key === "Enter") void handleSendCode(); });
els.code.addEventListener("keydown", (e) => { if (e.key === "Enter") void handleVerifyCode(); });

// Al abrir el popup: si ya hay sesión, ir directo a la app.
(async () => {
  try {
    const session = await getSession();
    if (session) {
      await showAppView(session);
    } else {
      showAuthEmailStep();
    }
  } catch (error) {
    console.error("init popup:", error);
    showAuthEmailStep();
    setStatus("Erreur d'initialisation. Recharge l'extension.", "error");
  }
})();
