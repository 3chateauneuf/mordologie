// The user's observed start and end are easier to enter than a duration.
// This is only an immediate preview. Rails validates and calculates the
// stored minutes; the form submits clock times, never a derived number.
(function () {
  const fields = document.querySelector("[data-actual-time]");
  if (!fields) return;

  const start = fields.querySelector("#time_block_actual_start_clock");
  const end = fields.querySelector("#time_block_actual_end_clock");
  const preview = fields.querySelector("[data-actual-preview]");
  const legacy = fields.querySelector(".editor-legacy-duration");
  if (!start || !end || !preview) return;

  function minutes(value) {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
    return match ? Number(match[1]) * 60 + Number(match[2]) : null;
  }

  function duration(total) {
    const hours = Math.floor(total / 60);
    const remainder = total % 60;
    if (hours && remainder) return hours + " h " + String(remainder).padStart(2, "0");
    if (hours) return hours + " h";
    return total + " min";
  }

  function update() {
    start.setCustomValidity("");
    end.setCustomValidity("");

    const first = minutes(start.value);
    const last = minutes(end.value);
    let error = "";

    if (!start.value && !end.value) {
      preview.textContent = "Durée réelle : —";
    } else if (!start.value || !end.value) {
      // Saving just the beginning is useful during an ongoing activity.
      preview.textContent = "Durée réelle : — (en attente des deux heures)";
    } else if (first === null || last === null) {
      error = "Indiquez des heures valides.";
    } else if (last <= first) {
      error = "La fin doit être après le début, le même jour.";
    } else {
      preview.textContent = "Durée réelle : " + duration(last - first);
    }

    if (error) {
      preview.textContent = error;
      // Keep the submit button available; native validation explains the
      // exact field preventing save, instead of silently disabling Save.
      if (!start.value) start.setCustomValidity(error);
      else end.setCustomValidity(error);
    }

    preview.classList.toggle("is-invalid", Boolean(error));
    if (legacy) legacy.hidden = Boolean(start.value || end.value);
  }

  [start, end].forEach(function (input) {
    input.addEventListener("input", update);
    input.addEventListener("change", update);
  });
  update();
})();
