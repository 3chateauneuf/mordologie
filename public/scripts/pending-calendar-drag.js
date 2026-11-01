// Dragging a pending task reserves its estimated duration at the dropped hour.
// This script owns only the drag gesture; Rails owns validation and persistence.
(function () {
  const cards = document.querySelectorAll("[data-pending-task-id]");
  const days = document.querySelectorAll(".day-body");
  if (!cards.length || !days.length) return;

  let draggedCard = null;
  let preview = null;
  let previewDay = null;

  function clock(minutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    return hours + ":" + mins;
  }

  function dropTime(event, day) {
    const rect = day.getBoundingClientRect();
    const startHour = Number(day.dataset.startHour);
    const slots = (Number(day.dataset.endHour) - startHour) * 4;
    const slotHeight = rect.height / slots;
    const index = Math.max(0, Math.min(slots - 1,
      Math.floor((event.clientY - rect.top) / slotHeight)));
    const startMinutes = startHour * 60 + index * 15;

    return {
      minutes: startMinutes,
      top: index * slotHeight
    };
  }

  function clearPreview() {
    if (preview) preview.remove();
    if (previewDay) previewDay.classList.remove("pending-drop-target");
    preview = null;
    previewDay = null;
  }

  function showPreview(event, day) {
    const location = dropTime(event, day);
    const duration = Number(draggedCard.dataset.pendingMinutes);
    const end = location.minutes + duration;
    const crossesMidnight = end > 24 * 60;

    if (previewDay !== day) clearPreview();
    previewDay = day;
    day.classList.add("pending-drop-target");

    if (!preview) {
      preview = document.createElement("div");
      preview.className = "pending-drop-preview";
      day.appendChild(preview);
    }

    preview.classList.toggle("is-invalid", crossesMidnight);
    preview.style.top = location.top + "px";
    preview.style.height = Math.max(24, Math.min(
      duration * day.getBoundingClientRect().height /
        ((Number(day.dataset.endHour) - Number(day.dataset.startHour)) * 60),
      day.getBoundingClientRect().height - location.top
    )) + "px";

    preview.textContent = crossesMidnight
      ? "Dépasse minuit"
      : clock(location.minutes) + " – " + clock(end);

    return location;
  }

  for (const card of cards) {
    card.addEventListener("dragstart", function (event) {
      if (event.target.closest("a, button, input, select")) {
        event.preventDefault();
        return;
      }

      draggedCard = card;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.dataset.pendingTaskId);
      card.classList.add("is-dragging");
    });

    card.addEventListener("dragend", function () {
      card.classList.remove("is-dragging");
      draggedCard = null;
      clearPreview();
    });
  }

  for (const day of days) {
    day.addEventListener("dragover", function (event) {
      if (!draggedCard) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      showPreview(event, day);
    });

    day.addEventListener("dragleave", function (event) {
      if (!day.contains(event.relatedTarget)) clearPreview();
    });

    day.addEventListener("drop", function (event) {
      if (!draggedCard) return;
      event.preventDefault();

      const location = dropTime(event, day);
      const form = draggedCard.querySelector("[data-schedule-task-form]");
      if (!form) return;

      form.elements.schedule_date.value = day.dataset.day;
      form.elements.start_clock.value = clock(location.minutes);

      clearPreview();
      form.requestSubmit();
    });
  }
})();
