// Red line at the current time in today's column, updated every minute.
// Hidden when the current time is outside the hours shown.
(function () {
  const line = document.querySelector("[data-now-line]");
  if (!line) return;

  const day = line.closest(".day-body");
  const label = line.querySelector("[data-now-line-time]");

  function place() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const first = Number(day.dataset.startHour) * 60;
    const last = Number(day.dataset.endHour) * 60;

    if (minutes < first || minutes >= last) {
      line.hidden = true;
      return;
    }
    const pixelsPerMinute = day.getBoundingClientRect().height / (last - first);
    line.style.top = (minutes - first) * pixelsPerMinute + "px";
    label.textContent = String(now.getHours()).padStart(2, "0") + ":" +
      String(now.getMinutes()).padStart(2, "0");
    line.hidden = false;
  }

  place();
  setInterval(place, 60 * 1000);
})();
