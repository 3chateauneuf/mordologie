// Reverse drag: a calendar block can return to the unscheduled inbox.
//
// The card contains its server-generated endpoint. A normal Rails form
// submits the change with CSRF protection; the browser never deletes a block
// until the pointer is released over the inbox.
(function () {
  const inbox = document.querySelector(".pending-panel");
  const form = inbox?.querySelector("[data-return-to-inbox-form]");
  if (!inbox || !form) return;

  let draggedBlock = null;

  function resetDropTarget() {
    inbox.classList.remove("is-calendar-drop-target");
  }

  document.querySelectorAll("[data-calendar-block-id]").forEach(function (block) {
    block.addEventListener("dragstart", function (event) {
      draggedBlock = block;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/x-planner-calendar-block", block.dataset.calendarBlockId);
      block.classList.add("is-calendar-dragging");
    });

    block.addEventListener("dragend", function () {
      block.classList.remove("is-calendar-dragging");
      draggedBlock = null;
      resetDropTarget();
    });
  });

  inbox.addEventListener("dragover", function (event) {
    if (!draggedBlock) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    inbox.classList.add("is-calendar-drop-target");
  });

  inbox.addEventListener("dragleave", function (event) {
    if (!inbox.contains(event.relatedTarget)) resetDropTarget();
  });

  inbox.addEventListener("drop", function (event) {
    if (!draggedBlock) return;

    event.preventDefault();
    const route = draggedBlock.dataset.returnToInboxUrl;
    if (!route) return;

    form.action = route;
    resetDropTarget();
    draggedBlock = null;
    form.requestSubmit();
  });
})();
