require "test_helper"

class BlockHistoryHttpTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "history-http@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    post session_path, params: { email: @user.email, password: "test-password-1234" }
    @block = @user.time_blocks.create!(
      title: "Montage", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
  end

  test "a move can be undone and redone" do
    post reschedule_time_block_path(@block),
         params: { schedule_date: "2026-11-03", start_clock: "14:00" }

    post undo_block_change_path
    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    assert_match "Annulé : déplacement de « Montage »", flash[:notice]
    assert_equal "2026-11-02 09:00", start_of(@block)

    post redo_block_change_path
    assert_equal "2026-11-03 14:00", start_of(@block)
  end

  test "a duplicate can be undone" do
    assert_difference("TimeBlock.count", 1) do
      post duplicate_time_block_path(@block),
           params: { schedule_date: "2026-11-02", start_clock: "11:00" }
    end
    assert_equal "Créneau dupliqué.", flash[:notice]

    assert_difference("TimeBlock.count", -1) { post undo_block_change_path }
    assert TimeBlock.exists?(@block.id)
  end

  test "a new block created in the calendar can be undone" do
    assert_difference("TimeBlock.count", 1) do
      post time_blocks_path, params: { time_block: {
        title: "Nouveau", category: "travail", schedule_date: "2026-11-04",
        start_clock: "10:00", duration_minutes: "30"
      } }
    end

    assert_difference("TimeBlock.count", -1) { post undo_block_change_path }
  end

  test "with nothing to undo the viewed day stays open" do
    post undo_block_change_path, params: { day: "2026-11-05" }

    assert_redirected_to root_path(week: "2026-11-05", day: "2026-11-05")
    assert_equal "Rien à annuler.", flash[:alert]
  end

  test "each person only undoes their own changes" do
    post reschedule_time_block_path(@block),
         params: { schedule_date: "2026-11-03", start_clock: "14:00" }
    delete session_path
    other = User.create!(email: "other-history@example.test",
                         password: "test-password-1234",
                         password_confirmation: "test-password-1234")
    post session_path, params: { email: other.email, password: "test-password-1234" }

    post undo_block_change_path
    assert_equal "Rien à annuler.", flash[:alert]
    assert_equal "2026-11-03 14:00", start_of(@block)
  end

  private

  def start_of(block)
    block.reload.start_at.in_time_zone.strftime("%F %H:%M")
  end
end
