require "test_helper"

class BlockHistoryTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "history@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    @history = BlockHistory.new(@user)
    @block = @user.time_blocks.create!(
      title: "Montage", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
  end

  test "undo puts a moved block back and redo moves it again" do
    move_to(Time.zone.local(2026, 11, 3, 14, 0))

    @history.undo
    assert_equal Time.zone.local(2026, 11, 2, 9, 0), @block.reload.start_at

    @history.redo
    assert_equal Time.zone.local(2026, 11, 3, 14, 0), @block.reload.start_at
  end

  test "undo restores the real times of a resize" do
    before = BlockHistory.snapshot(@block)
    @block.update!(actual_start_clock: "09:00", actual_end_clock: "11:40")
    @history.record("resize", @block, before: before)

    result = @history.undo
    assert_equal "changement de fin de « Montage »", result.change.label
    @block.reload
    assert_nil @block.actual_start_clock
    assert_nil @block.actual_end_clock
    assert_nil @block.actual_minutes
  end

  test "undoing a creation removes the block and redo brings it back" do
    created = @user.time_blocks.create!(
      title: "Nouveau", category: "vie", tags: ["projet"],
      start_at: Time.zone.local(2026, 11, 4, 9, 0),
      end_at: Time.zone.local(2026, 11, 4, 9, 30)
    )
    @history.record("create", created, before: nil)

    assert_nil @history.undo.block
    assert_not TimeBlock.exists?(created.id)

    restored = @history.redo.block
    assert_equal created.id, restored.id
    assert_equal "Nouveau", restored.title
    assert_equal ["projet"], restored.tags
  end

  test "redo after undoing a creation keeps later form edits" do
    created = @user.time_blocks.create!(
      title: "Nouveau", category: "travail",
      start_at: Time.zone.local(2026, 11, 4, 9, 0),
      end_at: Time.zone.local(2026, 11, 4, 9, 30)
    )
    @history.record("create", created, before: nil)
    created.update!(title: "Nouveau titre", notes: "Ajouté ensuite")

    @history.undo
    restored = @history.redo.block
    assert_equal "Nouveau titre", restored.title
    assert_equal "Ajouté ensuite", restored.notes
  end

  test "a form edit made after a move survives undoing the move" do
    move_to(Time.zone.local(2026, 11, 3, 14, 0))
    @block.update!(title: "Montage final")

    @history.undo
    @block.reload
    assert_equal "Montage final", @block.title
    assert_equal Time.zone.local(2026, 11, 2, 9, 0), @block.start_at
  end

  test "a new action clears what could be redone" do
    move_to(Time.zone.local(2026, 11, 3, 14, 0))
    @history.undo
    move_to(Time.zone.local(2026, 11, 2, 16, 0))

    assert_nil @history.redo
  end

  test "several undos go back step by step" do
    move_to(Time.zone.local(2026, 11, 2, 11, 0))
    move_to(Time.zone.local(2026, 11, 2, 13, 0))

    @history.undo
    assert_equal 11, @block.reload.start_at.in_time_zone.hour
    @history.undo
    assert_equal 9, @block.reload.start_at.in_time_zone.hour
    assert_nil @history.undo
  end

  test "only the latest changes are kept" do
    (BlockHistory::LIMIT + 5).times do |step|
      move_to(Time.zone.local(2026, 11, 2, 9, 0) + (step + 1).minutes)
    end

    assert_equal BlockHistory::LIMIT, @user.block_changes.count
  end

  test "an action that changes nothing is not recorded" do
    @history.record("move", @block, before: BlockHistory.snapshot(@block))

    assert_equal 0, @user.block_changes.count
  end

  test "deleting a block by hand forgets its history" do
    move_to(Time.zone.local(2026, 11, 3, 14, 0))
    TimeBlocks::DeletePermanently.new(block: @block).call

    assert_nil @history.undo
  end

  private

  def move_to(start_at)
    before = BlockHistory.snapshot(@block)
    @block.update!(start_at: start_at, end_at: start_at + 1.hour)
    @history.record("move", @block, before: before)
  end
end
