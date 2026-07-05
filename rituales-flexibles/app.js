const STORAGE_KEY = "rituales-flexibles-v1";
const DEV_SESSION_KEY = "rituales-flexibles-dev-session-v1";
const ACTIVE_WINDOW_MS = 45 * 1000;

const GROUPS = [
  { id: "salud", label: "Salud", tone: "Necesidades fisicas y medicas" },
  { id: "deporte", label: "Deporte", tone: "Activacion, fuerza y recuperacion" },
  { id: "familia", label: "Familia", tone: "Vinculos, cuidado y presencia" },
  { id: "trabajo", label: "Trabajo", tone: "Compromisos profesionales y foco" },
  { id: "curiosidad", label: "Curiosidad", tone: "Exploracion y aprendizaje libre" },
  { id: "hobbies", label: "Hobbies", tone: "Placer, juego y fabricacion" },
  { id: "desarrollo-personal", label: "Desarrollo personal", tone: "Cultivo interior y claridad" },
];

const groupList = document.querySelector("#group-list");
const ritualCards = document.querySelector("#ritual-cards");
const detailTitle = document.querySelector("#detail-title");
const detailBadge = document.querySelector("#detail-badge");
const detailBody = document.querySelector("#detail-body");
const historyTableWrap = document.querySelector("#history-table-wrap");
const ritualForm = document.querySelector("#ritual-form");
const ritualNameInput = document.querySelector("#ritual-name");
const ritualGroupInput = document.querySelector("#ritual-group");
const ritualImportanceInput = document.querySelector("#ritual-importance");
const ritualWaitInput = document.querySelector("#ritual-wait");
const ritualBufferInput = document.querySelector("#ritual-buffer");
const ritualNoteInput = document.querySelector("#ritual-note");
const completionForm = document.querySelector("#completion-form");
const completionDateInput = document.querySelector("#completion-date");
const completionTimeInput = document.querySelector("#completion-time");
const completeNowButton = document.querySelector("#complete-now");
const resetDemoButton = document.querySelector("#reset-demo");
const resetSessionButton = document.querySelector("#reset-session");
const sessionTotal = document.querySelector("#session-total");
const sessionVisible = document.querySelector("#session-visible");
const sessionActive = document.querySelector("#session-active");
const sessionWait = document.querySelector("#session-wait");
const sessionStarted = document.querySelector("#session-started");
const sessionStatus = document.querySelector("#session-status");

let state = loadState();
let devSession = loadDevSession();
let sessionTimerId = null;

bootstrap();

function bootstrap() {
  populateGroupSelect();
  setCompletionInputs(new Date());
  render();
  bindEvents();
  startSessionClock();
}

function bindEvents() {
  ritualForm.addEventListener("submit", handleRitualSubmit);
  completionForm.addEventListener("submit", handleCompletionSubmit);
  completeNowButton.addEventListener("click", handleCompleteNow);
  resetDemoButton.addEventListener("click", handleResetDemo);
  resetSessionButton.addEventListener("click", handleResetSession);

  ["pointerdown", "keydown", "input", "focus"].forEach((eventName) => {
    window.addEventListener(eventName, registerUserActivity, { passive: true });
  });

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("beforeunload", flushDevSession);
}

function loadState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("No se pudo leer el estado previo", error);
    }
  }
  return createDemoState();
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadDevSession() {
  const raw = window.localStorage.getItem(DEV_SESSION_KEY);
  const now = Date.now();
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        startedAt: parsed.startedAt || new Date(now).toISOString(),
        visibleMs: Number(parsed.visibleMs) || 0,
        activeMs: Number(parsed.activeMs) || 0,
        interactionCount: Number(parsed.interactionCount) || 0,
        lastTickAt: now,
        activeUntil: now,
      };
    } catch (error) {
      console.warn("No se pudo leer la sesion de desarrollo", error);
    }
  }

  return createDevSession(now);
}

function createDevSession(now = Date.now()) {
  return {
    startedAt: new Date(now).toISOString(),
    visibleMs: 0,
    activeMs: 0,
    interactionCount: 0,
    lastTickAt: now,
    activeUntil: now,
  };
}

function saveDevSession() {
  window.localStorage.setItem(
    DEV_SESSION_KEY,
    JSON.stringify({
      startedAt: devSession.startedAt,
      visibleMs: Math.round(devSession.visibleMs),
      activeMs: Math.round(devSession.activeMs),
      interactionCount: devSession.interactionCount,
    }),
  );
}

function createDemoState() {
  const rituals = [
    {
      id: crypto.randomUUID(),
      name: "Levothyrox",
      groupId: "salud",
      importance: "casi vital",
      note: "Tomarlo al comenzar el dia. Esperar antes de comer.",
      rules: {
        waitAfterMinutes: 30,
        softBufferMinutes: 60,
      },
    },
    {
      id: crypto.randomUUID(),
      name: "Movilidad suave",
      groupId: "deporte",
      importance: "medio",
      note: "Poner el cuerpo en marcha sin exigir heroismo.",
      rules: {
        waitAfterMinutes: 0,
        softBufferMinutes: 45,
      },
    },
    {
      id: crypto.randomUUID(),
      name: "Mensaje a familia",
      groupId: "familia",
      importance: "alto",
      note: "Un gesto de presencia cuenta mas que una regla perfecta.",
      rules: {
        waitAfterMinutes: 0,
        softBufferMinutes: 90,
      },
    },
  ];

  return {
    selectedRitualId: rituals[0].id,
    rituals,
    completions: buildDemoCompletions(rituals),
  };
}

function buildDemoCompletions(rituals) {
  const today = new Date();
  const items = [];
  const levothyrox = rituals[0];
  const movilidad = rituals[1];
  const familia = rituals[2];

  for (let dayOffset = 1; dayOffset <= 110; dayOffset += 1) {
    if (dayOffset % 11 === 0) {
      continue;
    }

    const date = shiftDate(today, -dayOffset);
    const weekday = date.getDay();
    const baseMinutes = weekday === 0 || weekday === 6 ? 8 * 60 + 5 : 7 * 60 + 28;
    const wobble = Math.round(Math.sin(dayOffset * 0.61) * 17 + Math.cos(dayOffset * 0.18) * 8);
    items.push(makeCompletion(levothyrox.id, date, baseMinutes + wobble));

    if (dayOffset % 2 === 0) {
      const moveBase = weekday === 0 || weekday === 6 ? 10 * 60 + 15 : 18 * 60 + 22;
      const moveWobble = Math.round(Math.sin(dayOffset * 0.73) * 24);
      items.push(makeCompletion(movilidad.id, date, moveBase + moveWobble));
    }

    if (dayOffset % 3 === 0) {
      const familyBase = 20 * 60 + 18;
      const familyWobble = Math.round(Math.cos(dayOffset * 0.41) * 35);
      items.push(makeCompletion(familia.id, date, familyBase + familyWobble));
    }
  }

  for (let delta = -10; delta <= 10; delta += 3) {
    const lastYearDate = shiftDate(today, -(365 + delta));
    const seasonalBase = 7 * 60 + 40 + delta;
    items.push(makeCompletion(levothyrox.id, lastYearDate, seasonalBase));
  }

  return items.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

function makeCompletion(ritualId, date, minutesFromMidnight) {
  const stamp = new Date(date);
  const clamped = Math.max(5 * 60, Math.min(23 * 60 + 20, minutesFromMidnight));
  stamp.setHours(Math.floor(clamped / 60), clamped % 60, 0, 0);
  return {
    id: crypto.randomUUID(),
    ritualId,
    completedAt: stamp.toISOString(),
  };
}

function populateGroupSelect() {
  ritualGroupInput.innerHTML = GROUPS.map(
    (group) => `<option value="${group.id}">${group.label}</option>`,
  ).join("");
}

function render() {
  renderGroups();
  renderRitualCards();
  renderDetail();
  renderSession();
  saveState();
}

function renderSession() {
  const now = Date.now();
  const totalMs = Math.max(0, now - new Date(devSession.startedAt).getTime());
  const visibleMs = Math.min(totalMs, Math.round(devSession.visibleMs));
  const activeMs = Math.min(totalMs, Math.round(devSession.activeMs));
  const waitMs = Math.max(0, totalMs - activeMs);
  const isActiveNow = now <= devSession.activeUntil;

  sessionTotal.textContent = formatDuration(totalMs);
  sessionVisible.textContent = formatDuration(visibleMs);
  sessionActive.textContent = formatDuration(activeMs);
  sessionWait.textContent = formatDuration(waitMs);
  sessionStarted.textContent = `Inicio de sesion: ${formatDateTime(devSession.startedAt)}.`;
  sessionStatus.textContent = isActiveNow
    ? `Estado actual: actividad detectada. Interacciones medidas: ${devSession.interactionCount}.`
    : `Estado actual: en espera o lectura. Interacciones medidas: ${devSession.interactionCount}.`;
}

function renderGroups() {
  groupList.innerHTML = GROUPS.map((group) => {
    const total = state.rituals.filter((ritual) => ritual.groupId === group.id).length;
    return `
      <article class="group-pill">
        <strong>${group.label}</strong>
        <p>${group.tone}</p>
        <small>${total} rito${total === 1 ? "" : "s"}</small>
      </article>
    `;
  }).join("");
}

function renderRitualCards() {
  ritualCards.innerHTML = state.rituals.map((ritual) => {
    const recommendation = getRecommendation(ritual);
    const selected = ritual.id === state.selectedRitualId ? "is-selected" : "";
    const group = GROUPS.find((item) => item.id === ritual.groupId);
    return `
      <article class="ritual-card ${selected}">
        <div class="ritual-topline">
          <strong>${ritual.name}</strong>
          <span class="badge">${ritual.importance}</span>
        </div>
        <span class="ritual-meta">${group ? group.label : ritual.groupId}</span>
        <p>${ritual.note || "Sin nota"}</p>
        <div class="ritual-window">${recommendation.windowLabel}</div>
        <p>${recommendation.reason}</p>
        <button type="button" data-ritual-select="${ritual.id}" aria-label="Seleccionar ${ritual.name}"></button>
      </article>
    `;
  }).join("");

  ritualCards.querySelectorAll("[data-ritual-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRitualId = button.dataset.ritualSelect;
      render();
    });
  });
}

function renderDetail() {
  const ritual = getSelectedRitual();
  if (!ritual) {
    detailTitle.textContent = "Selecciona un rito";
    detailBadge.textContent = "";
    detailBody.innerHTML = '<p class="empty">No hay rito seleccionado.</p>';
    historyTableWrap.innerHTML = "";
    return;
  }

  const recommendation = getRecommendation(ritual);
  const recent = getCompletionsForRitual(ritual.id).slice(0, 8);
  const todayCompletion = getLatestCompletionOnDate(ritual.id, new Date());
  let waitText = "No hay espera posterior configurada.";
  if (todayCompletion && ritual.rules.waitAfterMinutes) {
    waitText = `Puedes comer a partir de ${formatClock(addMinutes(new Date(todayCompletion.completedAt), ritual.rules.waitAfterMinutes))}.`;
  }

  detailTitle.textContent = ritual.name;
  detailBadge.textContent = `${getGroupLabel(ritual.groupId)} · ${ritual.importance}`;

  detailBody.innerHTML = `
    <section class="detail-summary">
      <div class="detail-topline">
        <div class="status-line ${todayCompletion ? "is-done" : ""}">
          ${todayCompletion ? "Hecho hoy" : "Pendiente hoy"}
        </div>
        <strong>${recommendation.windowLabel}</strong>
      </div>
      <p>${recommendation.reason}</p>
      <p><strong>Limite blando:</strong> ${recommendation.softDeadlineLabel}</p>
      <p><strong>Nota:</strong> ${ritual.note || "Sin nota registrada."}</p>
      ${
        todayCompletion
          ? `<p><strong>Ultimo registro de hoy:</strong> ${formatDayAndTime(todayCompletion.completedAt)}. ${waitText}</p>`
          : `<p><strong>Estado de hoy:</strong> aun no registrado.</p>`
      }
    </section>

    <section class="metrics-grid">
      <article class="metric">
        <span class="metric-label">Ancla historica</span>
        <strong>${recommendation.anchorLabel}</strong>
      </article>
      <article class="metric">
        <span class="metric-label">Muestra</span>
        <strong>${recommendation.sampleSize} eventos</strong>
      </article>
      <article class="metric">
        <span class="metric-label">Base principal</span>
        <strong>${recommendation.strategyLabel}</strong>
      </article>
    </section>

    <section>
      <p class="eyebrow">Historial reciente</p>
      <div class="history-list">
        ${
          recent.length
            ? recent
                .map(
                  (entry) => `
                    <article class="detail-summary">
                      <strong>${formatDayAndTime(entry.completedAt)}</strong>
                    </article>
                  `,
                )
                .join("")
            : '<p class="empty">Sin historial todavia.</p>'
        }
      </div>
    </section>
  `;

  historyTableWrap.innerHTML = renderHistoryTable(ritual);
}

function renderHistoryTable(ritual) {
  const sample = getRecommendation(ritual).sampleEntries.slice(0, 7);
  if (!sample.length) {
    return '<p class="empty">Aun no hay suficientes datos para explicar la sugerencia.</p>';
  }

  const rows = sample.map((entry) => {
    const date = new Date(entry.completedAt);
    return `
      <tr>
        <td>${formatDate(date)}</td>
        <td>${formatClock(date)}</td>
        <td>${entry.sourceLabel}</td>
      </tr>
    `;
  }).join("");

  return `
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Por que cuenta</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function getRecommendation(ritual) {
  const history = getCompletionsForRitual(ritual.id);
  const now = new Date();
  const recent90 = history.filter((entry) => isWithinDays(entry.completedAt, now, 90));
  const nearbyWeek = history.filter((entry) => isSameWeekday(entry.completedAt, now) && isWithinDays(entry.completedAt, now, 56));
  const seasonal = history.filter((entry) => isNearbyAnniversary(entry.completedAt, now, 8));

  const sampleEntries = [];
  let strategyLabel = "Fallback simple";

  if (seasonal.length >= 2) {
    strategyLabel = "Mismo periodo del ano pasado";
    seasonal.forEach((entry) => sampleEntries.push({ ...entry, weight: 1.45, sourceLabel: "Periodo anual cercano" }));
  }

  if (nearbyWeek.length >= 2) {
    if (sampleEntries.length === 0) {
      strategyLabel = "Semanas cercanas";
    }
    nearbyWeek.forEach((entry) => sampleEntries.push({ ...entry, weight: 1.15, sourceLabel: "Mismo dia de semana reciente" }));
  }

  if (recent90.length) {
    if (sampleEntries.length === 0) {
      strategyLabel = "Ultimos 3 meses";
    }
    recent90.forEach((entry) => sampleEntries.push({ ...entry, weight: 0.7, sourceLabel: "Base de 3 meses" }));
  }

  if (!sampleEntries.length) {
    const fallbackAnchor = 8 * 60;
    return {
      anchorMinutes: fallbackAnchor,
      anchorLabel: toClockLabel(fallbackAnchor),
      windowLabel: `${toClockLabel(fallbackAnchor - 20)} - ${toClockLabel(fallbackAnchor + 25)}`,
      softDeadlineLabel: toClockLabel(fallbackAnchor + ritual.rules.softBufferMinutes),
      reason: "Todavia no hay suficiente historial. La ventana es provisional.",
      strategyLabel,
      sampleEntries: [],
      sampleSize: 0,
    };
  }

  const weightedMinutes = sampleEntries.reduce(
    (acc, entry) => {
      const minutes = getMinutesFromMidnight(entry.completedAt);
      acc.total += minutes * entry.weight;
      acc.weight += entry.weight;
      acc.max = Math.max(acc.max, minutes);
      acc.min = Math.min(acc.min, minutes);
      return acc;
    },
    { total: 0, weight: 0, max: -Infinity, min: Infinity },
  );

  const anchorMinutes = Math.round(weightedMinutes.total / weightedMinutes.weight);
  const spread = Math.max(20, Math.min(55, Math.round((weightedMinutes.max - weightedMinutes.min) / 2) || 25));
  const windowStart = anchorMinutes - Math.round(spread * 0.7);
  const windowEnd = anchorMinutes + spread;
  const softDeadline = weightedMinutes.max + ritual.rules.softBufferMinutes;

  return {
    anchorMinutes,
    anchorLabel: toClockLabel(anchorMinutes),
    windowLabel: `${toClockLabel(windowStart)} - ${toClockLabel(windowEnd)}`,
    softDeadlineLabel: toClockLabel(softDeadline),
    reason: buildReason(strategyLabel, sampleEntries.length, ritual),
    strategyLabel,
    sampleEntries: sampleEntries.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)),
    sampleSize: sampleEntries.length,
  };
}

function buildReason(strategyLabel, sampleSize, ritual) {
  const waitLine = ritual.rules.waitAfterMinutes
    ? ` Despues deja ${ritual.rules.waitAfterMinutes} min antes de comer.`
    : "";
  return `La ventana sale de ${sampleSize} registros. La base principal es "${strategyLabel}" y luego se suaviza con tu historial reciente.${waitLine}`;
}

function getSelectedRitual() {
  return state.rituals.find((ritual) => ritual.id === state.selectedRitualId) || state.rituals[0];
}

function getCompletionsForRitual(ritualId) {
  return state.completions
    .filter((entry) => entry.ritualId === ritualId)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

function getLatestCompletionOnDate(ritualId, date) {
  return getCompletionsForRitual(ritualId).find((entry) => isSameLocalDate(entry.completedAt, date)) || null;
}

function handleRitualSubmit(event) {
  event.preventDefault();

  const ritual = {
    id: crypto.randomUUID(),
    name: ritualNameInput.value.trim(),
    groupId: ritualGroupInput.value,
    importance: ritualImportanceInput.value,
    note: ritualNoteInput.value.trim(),
    rules: {
      waitAfterMinutes: Number(ritualWaitInput.value) || 0,
      softBufferMinutes: Number(ritualBufferInput.value) || 45,
    },
  };

  if (!ritual.name) {
    return;
  }

  state.rituals.unshift(ritual);
  state.selectedRitualId = ritual.id;
  ritualForm.reset();
  ritualImportanceInput.value = "medio";
  ritualBufferInput.value = "45";
  render();
}

function handleCompletionSubmit(event) {
  event.preventDefault();
  const ritual = getSelectedRitual();
  if (!ritual) {
    return;
  }

  const stamp = new Date(`${completionDateInput.value}T${completionTimeInput.value}:00`);
  if (Number.isNaN(stamp.getTime())) {
    return;
  }

  state.completions.unshift({
    id: crypto.randomUUID(),
    ritualId: ritual.id,
    completedAt: stamp.toISOString(),
  });

  render();
}

function handleCompleteNow() {
  const now = new Date();
  setCompletionInputs(now);
  const ritual = getSelectedRitual();
  if (!ritual) {
    return;
  }

  state.completions.unshift({
    id: crypto.randomUUID(),
    ritualId: ritual.id,
    completedAt: now.toISOString(),
  });

  render();
}

function handleResetDemo() {
  state = createDemoState();
  setCompletionInputs(new Date());
  render();
}

function handleResetSession() {
  devSession = createDevSession(Date.now());
  saveDevSession();
  renderSession();
}

function startSessionClock() {
  registerUserActivity();
  flushDevSession();
  sessionTimerId = window.setInterval(() => {
    tickDevSession();
    renderSession();
  }, 1000);
}

function tickDevSession() {
  const now = Date.now();
  const delta = Math.max(0, now - devSession.lastTickAt);

  if (document.visibilityState === "visible") {
    devSession.visibleMs += delta;
  }

  if (now <= devSession.activeUntil) {
    devSession.activeMs += delta;
  }

  devSession.lastTickAt = now;

  if (now % 15000 < 1000) {
    saveDevSession();
  }
}

function registerUserActivity() {
  const now = Date.now();
  tickDevSession();
  devSession.activeUntil = Math.max(devSession.activeUntil, now + ACTIVE_WINDOW_MS);
  devSession.interactionCount += 1;
}

function handleVisibilityChange() {
  tickDevSession();
  renderSession();
  saveDevSession();
}

function flushDevSession() {
  tickDevSession();
  saveDevSession();
}

function setCompletionInputs(date) {
  completionDateInput.value = toDateInputValue(date);
  completionTimeInput.value = toTimeInputValue(date);
}

function getGroupLabel(groupId) {
  const group = GROUPS.find((item) => item.id === groupId);
  return group ? group.label : groupId;
}

function shiftDate(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isWithinDays(input, reference, days) {
  const diff = Math.abs(new Date(reference) - new Date(input));
  return diff <= days * 24 * 60 * 60 * 1000;
}

function isSameWeekday(input, reference) {
  return new Date(input).getDay() === new Date(reference).getDay();
}

function isNearbyAnniversary(input, reference, toleranceDays) {
  const date = new Date(input);
  const ref = new Date(reference);
  const sameYearGap = ref.getFullYear() - date.getFullYear();
  if (sameYearGap < 1 || sameYearGap > 2) {
    return false;
  }

  const currentYearVersion = new Date(ref.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.abs(startOfDay(ref) - startOfDay(currentYearVersion));
  return diff <= toleranceDays * 24 * 60 * 60 * 1000;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next.getTime();
}

function isSameLocalDate(input, reference) {
  const left = new Date(input);
  return (
    left.getFullYear() === reference.getFullYear() &&
    left.getMonth() === reference.getMonth() &&
    left.getDate() === reference.getDate()
  );
}

function addMinutes(date, minutes) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

function getMinutesFromMidnight(input) {
  const date = new Date(input);
  return date.getHours() * 60 + date.getMinutes();
}

function toClockLabel(totalMinutes) {
  const bounded = ((Math.round(totalMinutes) % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = String(Math.floor(bounded / 60)).padStart(2, "0");
  const minutes = String(bounded % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toDateInputValue(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function toTimeInputValue(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatClock(date) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDayAndTime(date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDuration(durationMs) {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
