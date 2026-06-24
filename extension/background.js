// Service worker de la extensión (MV3).
// Fase 1: vacío. En la fase "minuteur" mostrará el tiempo del chrono activo en
// el badge del icono (chrome.action.setBadgeText) vía chrome.alarms.
chrome.runtime.onInstalled.addListener(() => {
  // Placeholder — sin tareas de fondo todavía.
});
