// Red line at the current time in today's column, updated every minute.
// Hidden when the current time is outside the hours shown.
//
// The time is read in the calendar's time zone (data-time-zone, e.g.
// "Europe/Paris"), not the browser's, so it matches the blocks.
(function () {
  const line = document.querySelector("[data-now-line]");
  if (!line) return;

  const day = line.closest(".day-body");
  const label = line.querySelector("[data-now-line-time]");
  const clockFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: line.dataset.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });

  function place() {
    const clock = clockFormat.format(new Date()); // "14:07"
    const [hours, minutes] = clock.split(":").map(Number);
    const now = hours * 60 + minutes;
    const first = Number(day.dataset.startHour) * 60;
    const last = Number(day.dataset.endHour) * 60;

    if (now < first || now >= last) {
      line.hidden = true;
      return;
    }
    const pixelsPerMinute = day.getBoundingClientRect().height / (last - first);
    line.style.top = (now - first) * pixelsPerMinute + "px";
    label.textContent = clock;
    line.hidden = false;
  }

  place();
  setInterval(place, 60 * 1000);
})();
