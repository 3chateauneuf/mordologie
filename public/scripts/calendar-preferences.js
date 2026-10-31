// Keep the hour picker compact: a change saves immediately.
// Without JavaScript, the visible "Appliquer" button remains functional.
(function () {
  const form = document.querySelector("[data-calendar-start-form]");
  if (!form) return;

  const hour = form.querySelector("select[name='calendar_start_hour']");
  if (!hour) return;

  form.classList.add("is-enhanced");
  hour.addEventListener("change", function () {
    hour.disabled = true;
    // Re-enable before submitting so the chosen value is included.
    hour.disabled = false;
    form.requestSubmit();
  });
})();
