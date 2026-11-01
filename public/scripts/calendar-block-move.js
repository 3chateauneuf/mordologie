// Calendar event movement: use existing route-bound Rails forms.
(function () {
  let dragged = null;
  let gripOffset = 0;
  let preview = null;
  let previewDay = null;
  function clearPreview() {
    preview?.remove();
    previewDay?.classList.remove("calendar-move-target");
    preview = null;
    previewDay = null;
  }

  function showPreview(event, day) {
    const slot = startAt(event, day);
    if (previewDay !== day) clearPreview();
    previewDay = day;
    day.classList.add("calendar-move-target");
    if (!preview) {
      preview = document.createElement("div");
      preview.className = "calendar-move-preview";
      day.appendChild(preview);
    }
    const duration = Number(dragged.dataset.calendarDuration);
    preview.style.top = slot.top + "px";
    preview.style.height = Math.max(20, Math.min(duration * slot.heightPerMinute,
      day.getBoundingClientRect().height - slot.top)) + "px";
    const crossesMidnight = slot.minutes + duration > 1440;
    preview.classList.toggle("is-invalid", crossesMidnight);
    const end = slot.minutes + duration;
    preview.textContent = crossesMidnight ? "Dépasse minuit" :
      slot.clock + " – " + String(Math.floor(end / 60)).padStart(2, "0") +
      ":" + String(end % 60).padStart(2, "0");
  }

  document.querySelectorAll("[data-calendar-block-id]").forEach(block => {
    block.addEventListener("dragstart", event => {
      dragged = block;
      const distance = event.clientY - block.getBoundingClientRect().top;
      const durationPixels = Number(block.dataset.calendarDuration) * 1.1;
      gripOffset = Math.max(0, Math.min(distance, durationPixels - 1));
      block.classList.add("is-calendar-dragging");
      event.dataTransfer.effectAllowed = "move";
    });
    block.addEventListener("dragend", () => {
      block.classList.remove("is-calendar-dragging");
      dragged = null;
      clearPreview();
    });
  });
  document.querySelectorAll(".day-body").forEach(day => {
    day.addEventListener("dragover", event => {
      if (!dragged) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      showPreview(event, day);
    });
    day.addEventListener("dragleave", event => {
      if (!day.contains(event.relatedTarget)) clearPreview();
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
        Math.floor((event.clientY - rect.top - gripOffset) / (rect.height / slots))));
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
