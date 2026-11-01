require "test_helper"

class CalendarMoveTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "calendar-move@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    post session_path, params: {
      email: @user.email, password: "test-password-1234"
    }
    assert_redirected_to root_path
    @block = @user.time_blocks.create!(
      title: "Travail important", category: "travail",
      notes: "Ne pas oublier", tags: ["projet", "priorité"],
      actual_minutes: 27,
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 15)
    )
  end

  test "moving a linked block retains identity, duration and contents" do
    task = @user.planning_tasks.create!(
      title: @block.title, category: "travail",
      estimated_minutes: 75, scheduled_block: @block
    )
    assert_no_difference("TimeBlock.count") do
      post reschedule_time_block_path(@block),
           params: { schedule_date: "2026-11-03", start_clock: "14:15" }
    end
    assert_redirected_to root_path(week: "2026-11-03", day: "2026-11-03")
    assert_equal "2026-11-03 14:15", @block.reload.start_at.in_time_zone.strftime("%F %H:%M")
    assert_equal 75, @block.duration_minutes
    assert_equal @block.id, task.reload.scheduled_block_id
    assert_equal "Travail important", @block.title
    assert_equal "Ne pas oublier", @block.notes
    assert_equal ["projet", "priorité"], @block.tags
    assert_equal 27, @block.actual_minutes
  end

  test "invalid moves never overwrite the existing reservation" do
    original = [@block.start_at, @block.end_at]
    [
      { schedule_date: "2026-11-03", start_clock: "23:45" },
      { schedule_date: "2026-11-03", start_clock: "09:05" },
      { schedule_date: "not-a-date", start_clock: "09:00" }
    ].each do |attempt|
      post reschedule_time_block_path(@block), params: attempt
      assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
      assert_predicate flash[:alert], :present?
      assert_equal original, [@block.reload.start_at, @block.end_at]
    end
  end

  test "overlap is allowed but warned about" do
    @user.time_blocks.create!(
      title: "Autre activité", category: "reunion",
      start_at: Time.zone.local(2026, 11, 3, 14, 0),
      end_at: Time.zone.local(2026, 11, 3, 15, 0)
    )
    post reschedule_time_block_path(@block),
         params: { schedule_date: "2026-11-03", start_clock: "14:15" }
    assert_response :redirect
    assert_match(/chevauche/, flash[:notice])
    assert_equal "14:15", @block.reload.start_at.in_time_zone.strftime("%H:%M")
  end

  test "another user's block is not movable" do
    other = User.create!(
      email: "other-move@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    block = other.time_blocks.create!(
      title: "Privé", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    post reschedule_time_block_path(block),
         params: { schedule_date: "2026-11-04", start_clock: "10:00" }
    assert_response :not_found
    assert_equal "2026-11-02", block.reload.start_at.in_time_zone.to_date.iso8601
  end
end
