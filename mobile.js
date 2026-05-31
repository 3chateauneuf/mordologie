const SUPABASE_URL  = "https://mubyqnuajybakibzkxau.supabase.co";
const SUPABASE_ANON = "sb_publishable_FCIUSQCUz8f0bPA8lzdUWg_7bsrvsTV";

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── State ──────────────────────────────────────────────────────────────────
let activeSession = null;   // current active_sessions row
let timerInterval = null;   // live timer tick

// ── DOM refs ───────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

const screenAuth   = $("screen-auth");
const screenMain   = $("screen-main");

const cardSession  = $("card-session");
const cardNone     = $("card-no-session");
const sessionProj  = $("session-project");
const sessionTask  = $("session-task");
const sessionBadge = $("session-badge");
const sessionTimer = $("session-timer");
const btnStop      = $("btn-stop");

const listEntries  = $("list-entries");

const dialogStop   = $("dialog-stop");
const pausedNotice = $("stop-paused-notice");
const inputEndTime = $("input-end-time");
const inputNotes   = $("input-stop-notes");
const stopError    = $("stop-error");
const btnStopConfirm = $("btn-stop-confirm");
const btnStopCancel  = $("btn-stop-cancel");

// ── Helpers ────────────────────────────────────────────────────────────────

function toLocalInput(isoStr) {
  const d = new Date(isoStr);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function formatDuration(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
}

function formatDurationMin(minutes) {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatDate(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hideError(el) {
  el.textContent = "";
  el.classList.add("hidden");
}

// ── Auth ───────────────────────────────────────────────────────────────────

async function init() {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    showMain();
  } else {
    showAuth();
  }

  db.auth.onAuthStateChange((_event, session) => {
    if (session) showMain();
    else showAuth();
  });
}

function showAuth() {
  screenMain.classList.add("hidden");
  screenAuth.classList.remove("hidden");
  // Reset to step 1
  $("form-login").classList.remove("hidden");
  $("auth-sent").classList.add("hidden");
  stopPolling();
}

function showMain() {
  screenAuth.classList.add("hidden");
  screenMain.classList.remove("hidden");
  loadData();
  startPolling();
}

async function sendMagicLink(email) {
  const { error } = await db.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "https://mordologie.eduardodo.com/mobile",
    },
  });
  return error;
}

$("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError($("auth-error"));
  const btn = $("btn-login");
  btn.disabled = true;
  btn.textContent = "…";

  const email = $("input-email").value.trim();
  const error = await sendMagicLink(email);

  btn.disabled = false;
  btn.textContent = "Envoyer un lien";

  if (error) {
    showError($("auth-error"), error.message);
  } else {
    $("form-login").classList.add("hidden");
    $("auth-sent").classList.remove("hidden");
  }
});

$("btn-resend").addEventListener("click", async () => {
  $("auth-sent").classList.add("hidden");
  $("form-login").classList.remove("hidden");
});

$("btn-logout").addEventListener("click", async () => {
  await db.auth.signOut();
});

// ── Data loading ───────────────────────────────────────────────────────────

async function loadData() {
  await Promise.all([loadActiveSession(), loadRecentEntries()]);
}

async function loadActiveSession() {
  const { data, error } = await db
    .from("active_sessions")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) { console.error("active_sessions:", error); return; }
  setActiveSession(data);
}

async function loadRecentEntries() {
  const { data, error } = await db
    .from("time_entries")
    .select("time_entry_id, entry_date, started_at, ended_at, project_name, task_label, duration_minutes, notes")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) { console.error("time_entries:", error); return; }
  renderEntries(data ?? []);
}

// ── Active session ─────────────────────────────────────────────────────────

function setActiveSession(row) {
  activeSession = row;
  clearInterval(timerInterval);
  timerInterval = null;

  if (!row) {
    cardSession.classList.add("hidden");
    cardNone.classList.remove("hidden");
    return;
  }

  cardNone.classList.add("hidden");
  cardSession.classList.remove("hidden");

  sessionProj.textContent = row.project_name || "—";
  sessionTask.textContent = row.task_label   || "";

  const isPaused = !!row.paused_at;
  sessionBadge.textContent = isPaused ? "En pause" : "En cours";
  sessionBadge.className   = "session-badge " + (isPaused ? "paused" : "running");

  if (isPaused) {
    const elapsed = new Date(row.paused_at) - new Date(row.started_at);
    sessionTimer.textContent = formatDuration(elapsed);
  } else {
    const tick = () => {
      sessionTimer.textContent = formatDuration(Date.now() - new Date(row.started_at));
    };
    tick();
    timerInterval = setInterval(tick, 1000);
  }
}

// ── Polling ────────────────────────────────────────────────────────────────

let pollInterval = null;

function startPolling() {
  stopPolling();
  pollInterval = setInterval(loadData, 15000);
}

function stopPolling() {
  clearInterval(pollInterval);
  clearInterval(timerInterval);
  pollInterval = null;
  timerInterval = null;
}

// ── Recent entries ─────────────────────────────────────────────────────────

function renderEntries(rows) {
  if (rows.length === 0) {
    listEntries.innerHTML = '<p class="loading">Aucune entrée récente.</p>';
    return;
  }

  listEntries.innerHTML = rows.map((r) => {
    const dur = formatDurationMin(r.duration_minutes);
    const task = r.task_label ? `<div class="entry-task">${esc(r.task_label)}</div>` : "";
    const notes = r.notes ? `<div class="entry-notes">"${esc(r.notes)}"</div>` : "";
    return `
      <div class="entry-row">
        <div class="entry-top">
          <span class="entry-project">${esc(r.project_name || "—")}</span>
          ${dur ? `<span class="entry-duration">${dur}</span>` : ""}
        </div>
        ${task}
        <div class="entry-date">${formatDate(r.started_at || r.entry_date)}</div>
        ${notes}
      </div>`;
  }).join("");
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Stop flow ──────────────────────────────────────────────────────────────

btnStop.addEventListener("click", () => {
  if (!activeSession) return;
  hideError(stopError);

  const isPaused = !!activeSession.paused_at;
  const endDefault = isPaused ? activeSession.paused_at : new Date().toISOString();

  inputEndTime.value    = toLocalInput(endDefault);
  inputEndTime.disabled = isPaused;
  inputNotes.value      = "";

  isPaused
    ? pausedNotice.classList.remove("hidden")
    : pausedNotice.classList.add("hidden");

  dialogStop.classList.remove("hidden");
});

btnStopCancel.addEventListener("click", () => {
  dialogStop.classList.add("hidden");
});

dialogStop.addEventListener("click", (e) => {
  if (e.target === dialogStop) dialogStop.classList.add("hidden");
});

btnStopConfirm.addEventListener("click", async () => {
  if (!activeSession) return;
  hideError(stopError);

  const endedAt = inputEndTime.disabled
    ? activeSession.paused_at
    : new Date(inputEndTime.value).toISOString();

  if (!endedAt || isNaN(new Date(endedAt))) {
    showError(stopError, "Heure de fin invalide.");
    return;
  }

  btnStopConfirm.disabled = true;
  btnStopConfirm.textContent = "…";

  const { data, error } = await db.rpc("pocket_stop_session", {
    p_active_session_id: activeSession.active_session_id,
    p_ended_at:          endedAt,
    p_notes:             inputNotes.value.trim() || null,
  });

  btnStopConfirm.disabled = false;
  btnStopConfirm.textContent = "Confirmer";

  if (error) {
    showError(stopError, error.message);
    return;
  }

  if (data?.ok === false) {
    const msgs = {
      unauthenticated:         "Non authentifié.",
      session_not_found:       "Session introuvable.",
      session_missing_user_id: "Session sans utilisateur — arrêter depuis le bureau.",
      forbidden:               "Session appartenant à un autre utilisateur.",
      invalid_end_time:        "Heure de fin invalide (antérieure au début ou dans le futur).",
    };
    showError(stopError, msgs[data.error] ?? `Erreur : ${data.error}`);
    return;
  }

  // Success
  dialogStop.classList.add("hidden");
  setActiveSession(null);
  await loadRecentEntries();
});

// ── Boot ───────────────────────────────────────────────────────────────────
init();
