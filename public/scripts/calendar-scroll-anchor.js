// Opens the calendar at a useful hour instead of midnight.
//
// Every day shows 00:00–24:00. The server picks the hour to show first
// (data-scroll-hour): the current time minus one hour in the current week,
// the user's start hour otherwise. Earlier and later hours stay reachable
// by scrolling.
//
// On a desktop the grid scrolls inside its own frame (the day headings stay
// in place); on a phone the whole page scrolls.
(function () {
  const frame = document.querySelector("[data-calendar-scroll]");
  if (!frame) return;

  // Measure a day column that is shown: on a phone only the selected day is
  // (the others are display: none and measure 0).
  const day = frame.querySelector(".day-body.is-active-day") ||
    Array.from(frame.querySelectorAll(".day-body")).find(function (column) {
      return column.offsetHeight > 0;
    });
  if (!day) return;

  const hour = Number(frame.dataset.scrollHour);
  const firstHour = Number(day.dataset.startHour);
  const lastHour = Number(day.dataset.endHour);
  if (!Number.isFinite(hour) || hour <= firstHour) return;

  const pixelsPerHour = day.getBoundingClientRect().height / (lastHour - firstHour);
  const offset = (hour - firstHour) * pixelsPerHour;

  if (frame.scrollHeight > frame.clientHeight) {
    frame.scrollTop = offset;
  } else {
    const dayTop = day.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, dayTop + offset);
  }
})();
