// Reverse drag: a calendar block can return to the unscheduled inbox.
//
// Every block has a Rails-generated form bound to its exact POST endpoint.
// Never reassign an existing form's action: per-form CSRF tokens become invalid.
// The browser doesn't move any data until the pointer is released over the inbox.
(function () {
  const inbox = document.querySelector(".pending-panel");
  if (!inbox) return;

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
    const blockId = draggedBlock.dataset.calendarBlockId;
    const form = document.querySelector(
      '.return-to-inbox-form[data-return-block-id="' + blockId + '"]'
    );
    if (!form) {
      resetDropTarget();
      return;
    }

    resetDropTarget();
    draggedBlock = null;
    form.requestSubmit();
  });
})();
