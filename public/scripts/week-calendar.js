(function () {
  // On small screens show one selected day and position the scroll near
  // its earliest event rather than forcing a long scroll from midnight.
  const mobileCalendar = document.querySelector(".calendar-scroll");
  const activeDay = document.querySelector(".day-body.is-active-day");
  if (mobileCalendar && activeDay && window.matchMedia("(max-width:720px)").matches) {
    const first = Number(activeDay.dataset.firstEventHour);
    const startHour = Number(activeDay.dataset.startHour);
    mobileCalendar.scrollTop = Math.max(0, (Math.max(first, startHour) - startHour) * 66 - 28);
  }

  // Each grid hour is 66 px. Snap both clicks and selections to 15 minutes.
  const slotPixels = 66 / 4;
  const calendar = document.querySelector("[data-calendar]");
  if (!calendar) return;
  const scheduleUrl = calendar.dataset.newBlockUrl;
  let selection = null;
  let touchPoint = null;

  function slotAt(event, day) {
    const rect = day.getBoundingClientRect();
    const maxSlot = (Number(day.dataset.endHour) - Number(day.dataset.startHour)) * 4 - 1;
    return Math.max(0, Math.min(maxSlot, Math.floor((event.clientY - rect.top) / slotPixels)));
  }

  function openForm(day, firstSlot, slotCount) {
    const startMinutes = Number(day.dataset.startHour) * 60 + firstSlot * 15;
    const hour = Math.floor(startMinutes / 60);
    const minute = startMinutes % 60;
    const untilMidnight = 1440 - startMinutes - 1;
    const duration = Math.max(1, Math.min(slotCount * 15, 960, untilMidnight));
    const url = new URL(scheduleUrl, window.location.origin);
    url.searchParams.set("day", day.dataset.day);
    url.searchParams.set("hour", String(hour));
    url.searchParams.set("minute", String(minute));
    url.searchParams.set("duration", String(duration));
    window.location.assign(url.toString());
  }

  function clearSelection() {
    if (selection && selection.preview) selection.preview.remove();
    selection = null;
  }

  document.querySelectorAll(".day-body").forEach(function (day) {
    day.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "touch" && !event.target.closest(".event")) {
        touchPoint = { id: event.pointerId, day: day, slot: slotAt(event, day), y: event.clientY, x: event.clientX };
        return;
      }
      if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest(".event")) return;
      clearSelection();
      selection = {
        day: day,
        first: slotAt(event, day),
        last: slotAt(event, day),
        originY: event.clientY,
        dragging: false,
        preview: document.createElement("div")
      };
      selection.preview.className = "selection-preview";
    });

    // A double click creates a one-hour block; dragging selects any
    // 15-minute multiple, with exact values editable in the form.
    day.addEventListener("dblclick", function (event) {
      if (event.target.closest(".event")) return;
      openForm(day, slotAt(event, day), 4);
    });
  });

  document.addEventListener("pointermove", function (event) {
    if (touchPoint && event.pointerId === touchPoint.id &&
        (Math.abs(event.clientY - touchPoint.y) > 12 || Math.abs(event.clientX - touchPoint.x) > 12)) {
      touchPoint = null; // Scrolling isn't a tap.
    }
    if (!selection || event.pointerType !== "mouse") return;
    if (Math.abs(event.clientY - selection.originY) < 8 && !selection.dragging) return;
    selection.dragging = true;
    selection.last = slotAt(event, selection.day);
    const first = Math.min(selection.first, selection.last);
    const last = Math.max(selection.first, selection.last);
    selection.preview.style.top = String(first * slotPixels) + "px";
    selection.preview.style.height = String((last - first + 1) * slotPixels) + "px";
    selection.day.appendChild(selection.preview);
  });

  document.addEventListener("pointerup", function (event) {
    if (touchPoint && event.pointerId === touchPoint.id) {
      const tapped = touchPoint;
      touchPoint = null;
      openForm(tapped.day, tapped.slot, 4);
      return;
    }
    if (!selection) return;
    const current = selection;
    if (current.dragging) {
      event.preventDefault();
      const first = Math.min(current.first, current.last);
      const count = Math.max(current.first, current.last) - first + 1;
      clearSelection();
      openForm(current.day, first, count);
    } else {
      clearSelection();
    }
  });
  document.addEventListener("pointercancel", function () {
    touchPoint = null;
    clearSelection();
  });
  window.addEventListener("blur", clearSelection);
})();
