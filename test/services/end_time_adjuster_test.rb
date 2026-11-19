require "test_helper"

class EndTimeAdjusterTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "end-time@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    @block = @user.time_blocks.create!(
      title: "Montage", category: "work",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
  end

  test "a started block gets a real end and keeps its plan" do
    result = adjust(end_clock: "11:40", now: Time.zone.local(2026, 11, 2, 12, 0))

    assert result.success?
    assert_equal :actual, result.kind
    @block.reload
    assert_equal "09:00", @block.actual_start_clock
    assert_equal "11:40", @block.actual_end_clock
    assert_equal 160, @block.actual_minutes
    assert_equal Time.zone.local(2026, 11, 2, 10, 0), @block.end_at
  end

  test "an existing real start is kept" do
    @block.update!(actual_start_clock: "09:20")
    adjust(end_clock: "10:50", now: Time.zone.local(2026, 11, 2, 12, 0))

    assert_equal "09:20", @block.reload.actual_start_clock
    assert_equal 90, @block.actual_minutes
  end

  test "a future block moves its planned end" do
    result = adjust(end_clock: "10:45", now: Time.zone.local(2026, 11, 1, 18, 0))

    assert result.success?
    assert_equal :planned, result.kind
    @block.reload
    assert_equal Time.zone.local(2026, 11, 2, 10, 45), @block.end_at
    assert_nil @block.actual_end_clock
  end

  test "finish now uses the current time on the same day" do
    result = TimeBlocks::EndTimeAdjuster.new(
      block: @block, finish_now: true, now: Time.zone.local(2026, 11, 2, 11, 7)
    ).call

    assert result.success?
    assert_equal "11:07", @block.reload.actual_end_clock
  end

  test "finish now is refused for another day" do
    result = TimeBlocks::EndTimeAdjuster.new(
      block: @block, finish_now: true, now: Time.zone.local(2026, 11, 3, 11, 7)
    ).call

    assert_not result.success?
    assert_nil @block.reload.actual_end_clock
  end

  test "an end before the start never changes the stored block" do
    result = adjust(end_clock: "08:30", now: Time.zone.local(2026, 11, 2, 12, 0))

    assert_not result.success?
    @block.reload
    assert_nil @block.actual_start_clock
    assert_nil @block.actual_end_clock
  end

  test "a planned end keeps its wall-clock time on daylight-saving days" do
    autumn = @user.time_blocks.create!(
      title: "Changement d'heure", category: "work",
      start_at: Time.zone.local(2026, 10, 25, 9, 0),
      end_at: Time.zone.local(2026, 10, 25, 10, 0)
    )
    TimeBlocks::EndTimeAdjuster.new(block: autumn, end_clock: "10:45",
                                    now: Time.zone.local(2026, 10, 24, 18, 0)).call

    assert_equal "10:45", autumn.reload.end_at.in_time_zone.strftime("%H:%M")
  end

  test "an invalid clock is refused" do
    assert_not adjust(end_clock: "25:00", now: Time.zone.local(2026, 11, 2, 12, 0)).success?
  end

  private

  def adjust(end_clock:, now:)
    TimeBlocks::EndTimeAdjuster.new(block: @block, end_clock: end_clock, now: now).call
  end
end
