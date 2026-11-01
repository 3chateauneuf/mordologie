// Calendar event movement: use existing route-bound Rails forms.
(function () {
  let dragged = null;
  document.querySelectorAll("[data-calendar-block-id]").forEach(block => {
    block.addEventListener("dragstart", event => {
      dragged = block;
      event.dataTransfer.effectAllowed = "move";
    });
    block.addEventListener("dragend", () => { dragged = null; });
  });
  document.querySelectorAll(".day-body").forEach(day => {
    day.addEventListener("dragover", event => {
      if (dragged) event.preventDefault();
    });
    day.addEventListener("drop", event => {
      if (!dragged) return;
      event.preventDefault();
      const block = dragged;
      dragged = null;
      const rect = day.getBoundingClientRect();
      const first = Number(day.dataset.startHour) * 60;
      const slots = (Number(day.dataset.endHour) * 60 - first) / 15;
      const slot = Math.max(0, Math.min(slots - 1,
        Math.floor((event.clientY - rect.top) / (rect.height / slots))));
      const minutes = first + slot * 15;
      const clock = String(Math.floor(minutes / 60)).padStart(2, "0") +
        ":" + String(minutes % 60).padStart(2, "0");
      const form = document.querySelector(
        '.calendar-reschedule-form[data-reschedule-block-id="' +
        block.dataset.calendarBlockId + '"]');
      if (!form) return;
      form.elements.schedule_date.value = day.dataset.day;
      form.elements.start_clock.value = clock;
      form.requestSubmit();
    });
  });
})();
