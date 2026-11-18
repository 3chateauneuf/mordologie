// Red line at the current time in today's column, updated every minute.
//
// Time and date are read in the calendar's time zone (data-time-zone, e.g.
// "Europe/Paris"), not the browser's, so the line matches the blocks.
// If the page stays open past midnight, the line moves to the new day's
// column, or hides when that day is not on screen.
(function () {
  const line = document.querySelector("[data-now-line]");
  if (!line) return;

  const label = line.querySelector("[data-now-line-time]");
  const timeZone = line.dataset.timeZone;
  const clockFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });
  // "en-CA" writes dates as YYYY-MM-DD, like the columns' data-day.
  const dateFormat = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone, year: "numeric", month: "2-digit", day: "2-digit"
  });

  function place() {
    const now = new Date();
    const day = document.querySelector('.day-body[data-day="' + dateFormat.format(now) + '"]');
    if (!day) {
      line.hidden = true;
      return;
    }
    if (line.parentElement !== day) day.appendChild(line);

    const clock = clockFormat.format(now); // "14:07"
    const [hours, minutes] = clock.split(":").map(Number);
    const current = hours * 60 + minutes;
    const first = Number(day.dataset.startHour) * 60;
    const last = Number(day.dataset.endHour) * 60;
    if (current < first || current >= last) {
      line.hidden = true;
      return;
    }

    const pixelsPerMinute = day.getBoundingClientRect().height / (last - first);
    line.style.top = (current - first) * pixelsPerMinute + "px";
    label.textContent = clock;
    line.hidden = false;
  }

  place();
  setInterval(place, 60 * 1000);
})();
