// Hover card for blocks that have a note or tags (with a mouse only).
//
// Each such block carries data-preview-title, -times, -tags and -notes.
// After a short pause over the block, the shared card shows them next to it,
// so the dialog doesn't need to be opened just to read a note.
(function () {
  const card = document.querySelector("[data-event-hovercard]");
  if (!card) return;

  const fields = {
    title: card.querySelector("[data-hovercard-title]"),
    times: card.querySelector("[data-hovercard-times]"),
    tags: card.querySelector("[data-hovercard-tags]"),
    notes: card.querySelector("[data-hovercard-notes]")
  };
  const delay = 350;
  let timer = null;

  function show(block) {
    fields.title.textContent = block.dataset.previewTitle;
    fields.times.textContent = block.dataset.previewTimes;
    fields.tags.textContent = block.dataset.previewTags;
    fields.tags.hidden = !block.dataset.previewTags;
    fields.notes.textContent = block.dataset.previewNotes;
    fields.notes.hidden = !block.dataset.previewNotes;
    card.hidden = false;
    place(block);
  }

  // To the right of the block, or to its left when there is no room.
  function place(block) {
    const rect = block.getBoundingClientRect();
    const width = card.offsetWidth;
    const height = card.offsetHeight;
    const fitsRight = rect.right + 8 + width <= window.innerWidth - 8;
    const left = fitsRight ? rect.right + 8 : Math.max(8, rect.left - 8 - width);
    const top = Math.min(Math.max(8, rect.top), window.innerHeight - height - 8);
    card.style.left = left + "px";
    card.style.top = top + "px";
  }

  function hide() {
    clearTimeout(timer);
    card.hidden = true;
  }

  document.querySelectorAll("[data-preview]").forEach(function (block) {
    // Only a mouse: a finger tap on a phone opens the block instead.
    block.addEventListener("pointerenter", function (event) {
      if (event.pointerType !== "mouse") return;
      clearTimeout(timer);
      timer = setTimeout(function () { show(block); }, delay);
    });
    block.addEventListener("pointerleave", hide);
    // Moving, resizing or clicking the block: the card would be in the way.
    block.addEventListener("pointerdown", hide);
    block.addEventListener("dragstart", hide);
  });
  window.addEventListener("scroll", hide, { passive: true });
})();
