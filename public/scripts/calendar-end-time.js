// Quick end-time changes from the calendar.
//
// - Click a block's end time: a small editor opens (type a time,
//   "+15 / +30 / +1 h", or "Terminer maintenant" for the task in progress).
// - Drag a block's bottom edge: the end moves in 5-minute steps.
//
// Every change is sent through the block's own Rails form
// (.calendar-end-time-form). The server decides whether it is the real end
// (block already started) or the planned end (future block).
(function () {
  const popover = document.querySelector("[data-end-time-popover]");
  if (!popover) return;

  const input = popover.querySelector("[data-end-time-input]");
  const title = popover.querySelector("[data-end-time-title]");
  const hint = popover.querySelector("[data-end-time-hint]");
  const finishNowButton = popover.querySelector("[data-end-time-finish-now]");
  let openBlock = null;
  let openTrigger = null;

  // ---- Clock helpers ("HH:MM" <-> minutes since midnight) ----

  function toMinutes(clock) {
    const [hours, minutes] = clock.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function toClock(totalMinutes) {
    const minutes = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
    return String(Math.floor(minutes / 60)).padStart(2, "0") + ":" +
      String(minutes % 60).padStart(2, "0");
  }

  // ---- Sending a change ----

  function submitEnd(block, values) {
    const form = document.querySelector(
      '.calendar-end-time-form[data-end-time-block-id="' + block.dataset.calendarBlockId + '"]');
    if (!form) return;
    form.elements.end_clock.value = values.endClock || "";
    form.elements.finish_now.value = values.finishNow ? "1" : "";
    form.requestSubmit();
  }

  // ---- Popover ----

  function openPopover(block, trigger) {
    openBlock = block;
    openTrigger = trigger;
    const isActual = block.dataset.endKind === "actual";
    title.textContent = isActual ? "Fin réelle" : "Fin prévue";
    hint.textContent = "Début : " + block.dataset.displayStartClock;
    input.value = block.dataset.endClock;
    input.setCustomValidity("");
    finishNowButton.hidden = block.dataset.finishNow !== "true";

    popover.hidden = false;
    placePopover(trigger);
    input.focus();
    input.select?.();
  }

  function closePopover() {
    if (popover.hidden) return;
    popover.hidden = true;
    openTrigger?.focus();
    openBlock = null;
    openTrigger = null;
  }

  // Desktop: next to the clicked time. Mobile: CSS turns it into a bottom sheet.
  function placePopover(trigger) {
    if (window.matchMedia("(max-width: 720px)").matches) {
      popover.style.top = "";
      popover.style.left = "";
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const width = popover.offsetWidth;
    const height = popover.offsetHeight;
    const left = Math.min(rect.left, window.innerWidth - width - 12);
    const below = rect.bottom + 6;
    const top = below + height > window.innerHeight ? rect.top - height - 6 : below;
    popover.style.left = Math.max(12, left) + "px";
    popover.style.top = Math.max(12, top) + "px";
  }

  // Any minute is accepted; the end only has to come after the start.
  // (A "min" attribute would also shift the step grid, so it is not used.)
  function save() {
    if (!openBlock) return;
    const afterStart = input.value &&
      toMinutes(input.value) > toMinutes(openBlock.dataset.displayStartClock);
    input.setCustomValidity(afterStart ? "" :
      "La fin doit être après le début (" + openBlock.dataset.displayStartClock + ").");
    if (!input.reportValidity()) return;
    submitEnd(openBlock, { endClock: input.value });
  }

  document.querySelectorAll("[data-end-time-trigger]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const block = trigger.closest("[data-calendar-block-id]");
      if (openBlock === block) {
        closePopover();
      } else {
        openPopover(block, trigger);
      }
    });
  });

  // "+15 min", "+30 min", "+1 h": extend and save straight away.
  popover.querySelectorAll("[data-end-time-add]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!openBlock) return;
      const base = input.value || openBlock.dataset.endClock;
      submitEnd(openBlock, { endClock: toClock(toMinutes(base) + Number(button.dataset.endTimeAdd)) });
    });
  });

  finishNowButton.addEventListener("click", function () {
    if (openBlock) submitEnd(openBlock, { finishNow: true });
  });
  popover.querySelector("[data-end-time-save]").addEventListener("click", save);
  popover.querySelector("[data-end-time-cancel]").addEventListener("click", closePopover);

  input.addEventListener("input", function () { input.setCustomValidity(""); });
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePopover();
  });
  document.addEventListener("pointerdown", function (event) {
    if (!popover.hidden && !popover.contains(event.target) &&
        !event.target.closest("[data-end-time-trigger]")) {
      closePopover();
    }
  });

  // ---- Dragging the bottom edge ----

  const stepMinutes = 5;
  let resizing = null;

  function minutesAt(clientY, day) {
    const rect = day.getBoundingClientRect();
    const firstMinute = Number(day.dataset.startHour) * 60;
    const lastMinute = Number(day.dataset.endHour) * 60;
    const perPixel = (lastMinute - firstMinute) / rect.height;
    const raw = firstMinute + (clientY - rect.top) * perPixel;
    return Math.round(raw / stepMinutes) * stepMinutes;
  }

  document.querySelectorAll("[data-end-time-resize]").forEach(function (handle) {
    handle.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      const block = handle.closest("[data-calendar-block-id]");
      const day = block.closest(".day-body");
      event.preventDefault();
      event.stopPropagation();
      // The block itself can be dragged to move it; not while resizing.
      block.draggable = false;
      handle.setPointerCapture(event.pointerId);
      closePopover();
      resizing = {
        block: block,
        day: day,
        handle: handle,
        label: block.querySelector("[data-end-time-trigger]"),
        originalLabel: block.dataset.endClock,
        originalHeight: block.style.height,
        startMinutes: toMinutes(block.dataset.displayStartClock),
        endMinutes: toMinutes(block.dataset.endClock),
        pixelsPerMinute: day.getBoundingClientRect().height /
          ((Number(day.dataset.endHour) - Number(day.dataset.startHour)) * 60)
      };
      block.classList.add("is-resizing");
    });

    handle.addEventListener("pointermove", function (event) {
      if (!resizing || resizing.handle !== handle) return;
      const latest = 24 * 60 - stepMinutes;
      const end = Math.max(resizing.startMinutes + stepMinutes,
        Math.min(latest, minutesAt(event.clientY, resizing.day)));
      resizing.endMinutes = end;
      const visibleStart = Math.max(resizing.startMinutes,
        Number(resizing.day.dataset.startHour) * 60);
      resizing.block.style.height =
        Math.max(20, (end - visibleStart) * resizing.pixelsPerMinute) + "px";
      resizing.label.textContent = toClock(end);
    });

    function finishResize(cancelled) {
      if (!resizing || resizing.handle !== handle) return;
      const current = resizing;
      resizing = null;
      current.block.draggable = true;
      current.block.classList.remove("is-resizing");
      const newClock = toClock(current.endMinutes);
      if (cancelled || newClock === current.originalLabel) {
        current.block.style.height = current.originalHeight;
        current.label.textContent = current.originalLabel;
        return;
      }
      submitEnd(current.block, { endClock: newClock });
    }

    handle.addEventListener("pointerup", function () { finishResize(false); });
    handle.addEventListener("pointercancel", function () { finishResize(true); });
  });
})();
