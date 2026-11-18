// Block editor: start, duration and end stay in sync.
// Editing the end recalculates the duration; the duration is what the
// server receives (the end field has no name).
(function () {
  const form = document.querySelector("[data-schedule-form]");
  if (!form) return;
  const date = form.querySelector("#time_block_schedule_date");
  const time = form.querySelector("#time_block_start_clock");
  const duration = form.querySelector("#time_block_duration_minutes");
  const endInput = form.querySelector("[data-end-input]");
  const endMessage = form.querySelector("[data-end-message]");
  const endBox = form.querySelector(".editor-end");
  const submit = document.getElementById("planner-time-block-submit");
  const durationButtons = Array.from(form.querySelectorAll("[data-duration]"));

  function minutesOf(clock) {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(clock);
    return match ? Number(match[1]) * 60 + Number(match[2]) : null;
  }

  function clockOf(totalMinutes) {
    return String(Math.floor(totalMinutes / 60)).padStart(2, "0") + ":" +
      String(totalMinutes % 60).padStart(2, "0");
  }

  function showState(problem) {
    endMessage.textContent = problem || "";
    endBox.classList.toggle("is-invalid", Boolean(problem));
    submit.disabled = Boolean(problem) || !date.value;
    durationButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.duration) === Number(duration.value)));
    });
  }

  // Start or duration changed: show the resulting end.
  function updateEnd() {
    const start = minutesOf(time.value);
    const minutes = Number(duration.value);
    // The longest duration comes from the field (16 h for a plan, the whole
    // day for real times).
    if (start === null || !Number.isInteger(minutes) || minutes < 1 || minutes > Number(duration.max)) {
      endInput.value = "";
      showState("—");
      return;
    }
    if (start + minutes >= 1440) {
      endInput.value = "";
      showState(plannerText("after_midnight"));
      return;
    }
    endInput.value = clockOf(start + minutes);
    showState("");
  }

  // End changed by hand: the duration follows.
  function updateDuration() {
    const start = minutesOf(time.value);
    const end = minutesOf(endInput.value);
    if (start === null || end === null) return;
    if (end <= start) {
      showState(plannerText("end_before_start"));
      return;
    }
    duration.value = String(end - start);
    showState("");
  }

  durationButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      duration.value = button.dataset.duration;
      updateEnd();
    });
  });
  [date, time, duration].forEach(function (input) {
    input.addEventListener("input", updateEnd);
    input.addEventListener("change", updateEnd);
  });
  endInput.addEventListener("input", updateDuration);
  endInput.addEventListener("change", updateDuration);
  updateEnd();

  // The comma-separated input is a no-JS fallback. JS progressively adds
  // compact removable chips while still submitting the same underlying field.
  const editor = form.querySelector("[data-tags-editor]");
  const source = form.querySelector("#time_block_tag_list");
  const entry = form.querySelector("[data-tag-entry]");
  const chipArea = form.querySelector("[data-tag-chips]");
  const message = form.querySelector("[data-tag-message]");
  if (editor && source && entry && chipArea) {
    function normalize(text) {
      return text.trim().replace(/^#/, "").trim().toLocaleLowerCase("fr");
    }
    let tags = [...new Set(source.value.split(",").map(normalize).filter(Boolean))];
    function inform(text) { message.textContent = text; }
    function draw() {
      source.value = tags.join(", ");
      chipArea.replaceChildren();
      tags.forEach(function (tag) {
        const chip = document.createElement("span");
        chip.className = "editor-tag-chip";
        const text = document.createElement("span");
        text.textContent = "#" + tag;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Retirer " + tag);
        remove.addEventListener("click", function () {
          tags = tags.filter(function (item) { return item !== tag; });
          draw();
          entry.focus();
        });
        chip.append(text, remove);
        chipArea.appendChild(chip);
      });
    }
    function add(value) {
      const incoming = value.split(",").map(normalize).filter(Boolean);
      for (const tag of incoming) {
        if (tag.length > 40) { inform(plannerText("tag_too_long")); return false; }
        if (tags.includes(tag)) continue;
        if (tags.length >= 12) { inform(plannerText("too_many_tags")); return false; }
        tags.push(tag);
      }
      inform("");
      draw();
      return true;
    }
    function commitEntry() {
      if (!entry.value.trim()) return true;
      if (!add(entry.value)) return false;
      entry.value = "";
      return true;
    }
    editor.classList.add("is-enhanced");
    entry.hidden = false;
    draw();
    editor.addEventListener("click", function (event) {
      if (!event.target.closest("button")) entry.focus();
    });
    entry.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        commitEntry();
      } else if (event.key === "Backspace" && !entry.value && tags.length) {
        tags.pop();
        draw();
      }
    });
    entry.addEventListener("blur", commitEntry);
    form.querySelectorAll("[data-suggest-tag]").forEach(function (button) {
      button.addEventListener("click", function () {
        add(button.dataset.suggestTag);
        entry.focus();
      });
    });
    form.addEventListener("submit", function (event) {
      if (!commitEntry()) {
        event.preventDefault();
        entry.focus();
      }
    });
  }
})();
