require "test_helper"

class DuplicatorTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "duplicate@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    @block = @user.time_blocks.create!(
      title: "Montage", category: "reunion", notes: "Notes", tags: ["vidéo"],
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0),
      actual_start_clock: "09:00", actual_end_clock: "10:30"
    )
  end

  test "the copy keeps contents and drawn length, without real times" do
    result = duplicate("2026-11-03", "14:00")

    assert result.success?
    copy = result.block
    assert_not_equal @block.id, copy.id
    assert_equal ["Montage", "reunion", "Notes", ["vidéo"]],
                 [copy.title, copy.category, copy.notes, copy.tags]
    assert_equal Time.zone.local(2026, 11, 3, 14, 0), copy.start_at
    assert_equal 90, copy.duration_minutes
    assert_nil copy.actual_start_clock
    assert_nil copy.actual_minutes
  end

  test "the original is not changed" do
    duplicate("2026-11-03", "14:00")

    assert_equal Time.zone.local(2026, 11, 2, 9, 0), @block.reload.start_at
    assert_equal "10:30", @block.actual_end_clock
  end

  test "a copy that would pass midnight is refused" do
    assert_no_difference("TimeBlock.count") do
      assert_not duplicate("2026-11-03", "23:00").success?
    end
  end

  private

  def duplicate(date, clock)
    TimeBlocks::Duplicator.new(block: @block, date: date, clock: clock).call
  end
end
