// A single confirmation handler works both inside dialogs and in the inbox.
(function () {
  document.addEventListener("submit", function (event) {
    const form = event.target;
    if (!form.matches("form[data-confirm-destroy]")) return;
    if (!window.confirm(form.dataset.confirmDestroy)) event.preventDefault();
  }, true);
})();
