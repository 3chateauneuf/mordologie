// Calendar settings (in the toolbar's settings menu): changing a menu saves
// immediately. Without JavaScript, the "Apply" button remains functional.
(function () {
  const form = document.querySelector("[data-settings-form]");
  if (!form) return;

  form.classList.add("is-enhanced");
  form.querySelectorAll("select").forEach(function (menu) {
    menu.addEventListener("change", function () {
      form.requestSubmit();
    });
  });
})();
