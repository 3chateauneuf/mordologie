// Keyboard undo / redo for the calendar (desktop).
//
//   Ctrl+Z (Cmd+Z on Mac)             undo the last move, resize, creation or copy
//   Ctrl+Shift+Z (Cmd+Shift+Z), Ctrl+Y  redo
//
// The history lives on the server (BlockHistory): the page reloads after each
// change, so the browser alone could not remember it.
(function () {
  const undoForm = document.querySelector('[data-history-form="undo"]');
  const redoForm = document.querySelector('[data-history-form="redo"]');
  if (!undoForm || !redoForm) return;

  let sending = false;

  // Typing in a field keeps the browser's own Ctrl+Z.
  function isTyping(target) {
    return target.closest("input, textarea, select, [contenteditable='true']") !== null;
  }

  document.addEventListener("keydown", function (event) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    if (isTyping(event.target)) return;

    const key = event.key.toLowerCase();
    let form = null;
    if (key === "z") form = event.shiftKey ? redoForm : undoForm;
    if (key === "y" && event.ctrlKey && !event.shiftKey) form = redoForm;
    if (!form) return;

    event.preventDefault();
    if (sending) return; // One step per page load: keys held down don't pile up.
    sending = true;
    form.requestSubmit();
  });
})();
