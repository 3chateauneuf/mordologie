// Keep the calendar settings compact: changing a menu saves immediately.
// Without JavaScript, the visible "Aplicar" button remains functional.
(function () {
  const form = document.querySelector("[data-calendar-start-form]");
  if (!form) return;

  form.classList.add("is-enhanced");
  form.querySelectorAll("select").forEach(function (menu) {
    menu.addEventListener("change", function () {
      form.requestSubmit();
    });
  });
})();
