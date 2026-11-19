# Undo / redo for calendar actions: move, resize, create and duplicate.
#
#   history = BlockHistory.new(user)
#   before = BlockHistory.snapshot(block)       # before changing the block
#   ...change and save the block...
#   history.record("move", block, before: before)
#
#   history.undo  # puts the latest change back (Ctrl+Z)
#   history.redo  # re-applies the latest undone change (Ctrl+Shift+Z)
#
# A new action clears what could be redone, as in any editor.
# Only the last LIMIT changes are kept.
class BlockHistory
  LIMIT = 5 # A safety net for slips, not a full log.
  TIME_FIELDS = %w[start_at end_at actual_start_clock actual_end_clock actual_minutes].freeze
  FIELDS = (%w[title category notes tags] + TIME_FIELDS).freeze

  Result = Struct.new(:change, :block, keyword_init: true)

  def self.snapshot(block)
    FIELDS.index_with { |field| block.public_send(field) }.as_json
  end

  def initialize(user)
    @user = user
  end

  def record(action, block, before:)
    after = self.class.snapshot(block)
    return if before == after # Nothing changed, nothing to undo.

    serialized do
      @user.block_changes.undone.delete_all
      @user.block_changes.create!(action: action, time_block_id: block.id,
                                  state_before: before, state_after: after)
      prune
    end
  end

  # Returns nil when there is nothing to undo.
  def undo
    serialized do
      change = @user.block_changes.active.order(id: :desc).first
      next nil unless change

      block = restore(change, change.state_before)
      change.update!(undone_at: Time.current)
      Result.new(change: change, block: block)
    end
  end

  # Returns nil when there is nothing to redo.
  def redo
    serialized do
      change = @user.block_changes.undone.order(:id).first
      next nil unless change

      block = restore(change, change.state_after)
      change.update!(undone_at: nil)
      Result.new(change: change, block: block)
    end
  end

  # A block deleted by hand leaves no history behind.
  def self.forget(block)
    BlockChange.where(time_block_id: block.id).delete_all
  end

  private

  # Bring a block back to a snapshot. A nil snapshot means "did not exist".
  #
  # Moves and resizes only put the times back: a title or note edited in the
  # form since then is kept.
  def restore(change, state)
    block = @user.time_blocks.find_by(id: change.time_block_id)

    if state.nil?
      # Keep what is being removed (including later form edits), so that
      # redo brings back exactly this block.
      change.update!(state_after: self.class.snapshot(block)) if block
      block&.destroy!
      return nil
    end

    fields = change.created_block? ? FIELDS : TIME_FIELDS
    block ||= @user.time_blocks.new(id: change.time_block_id)
    block.assign_attributes(state.slice(*fields).except("actual_minutes"))
    block.save!
    # The model recalculates actual minutes from the clocks. An old entry may
    # have minutes without clocks: restore the stored value exactly.
    block.update_columns(actual_minutes: state["actual_minutes"])
    block
  end

  # One history operation at a time per person: two tabs pressing Ctrl+Z
  # together undo two steps, never the same one twice.
  def serialized(&block)
    @user.with_lock(&block)
  end

  def prune
    keep = @user.block_changes.order(id: :desc).limit(LIMIT).pluck(:id)
    @user.block_changes.where.not(id: keep).delete_all
  end
end
