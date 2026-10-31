/*
 * Planner dialog convention:
 *   <div data-planner-dialog data-dismiss-url="/path" ...>
 *     <section data-planner-dialog-panel role="dialog" aria-labelledby="...">
 *       ...controls and content...
 *     </section>
 *   </div>
 *
 * All desktop dialogs close via Escape or backdrop click, without saving.
 * Mobile dialogs remain regular full-page screens.
 * Include a regular return link for JS-disabled and mobile navigation.
 */
(function () {
  function installDialogBehaviors() {
    const desktop = window.matchMedia("(min-width: 721px)");
    const dialogs = Array.from(document.querySelectorAll("[data-planner-dialog]"));
    if (!dialogs.length) return;

    function close(dialog) {
      const url = dialog.getAttribute("data-dismiss-url");
      if (url) window.location.assign(url);
    }
    function topDialog() {
      return dialogs.filter(function (dialog) { return dialog.isConnected; }).pop();
    }
    function isVisible(element) {
      return element.getClientRects().length > 0 && !element.disabled;
    }
    function focusableIn(dialog) {
      return Array.from(dialog.querySelectorAll(
        "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
      )).filter(isVisible);
    }
    function updateMode() {
      dialogs.forEach(function (dialog) {
        const panel = dialog.querySelector("[data-planner-dialog-panel]");
        if (!panel) return;
        if (desktop.matches) {
          panel.setAttribute("aria-modal", "true");
        } else {
          panel.removeAttribute("aria-modal");
        }
      });
    }
    updateMode();
    desktop.addEventListener("change", updateMode);

    // Shared confirmation for destructive actions; no inline JS in ERB.
    document.addEventListener("submit", function (event) {
      const form = event.target;
      if (!form.matches("form[data-confirm-destroy]")) return;
      if (!window.confirm(form.dataset.confirmDestroy)) event.preventDefault();
    }, true);

    dialogs.forEach(function (dialog) {
      dialog.addEventListener("click", function (event) {
        if (desktop.matches && event.target === dialog) close(dialog);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!desktop.matches) return;
      const dialog = topDialog();
      if (!dialog) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(dialog);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = focusableIn(dialog);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first ||
          !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last ||
                 !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    });

    if (desktop.matches) {
      const dialog = topDialog();
      const titleField = dialog && dialog.querySelector("input[name='time_block[title]']");
      if (titleField) titleField.focus({ preventScroll: true });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installDialogBehaviors, { once: true });
  } else {
    installDialogBehaviors();
  }
})();
