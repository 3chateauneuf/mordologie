require "test_helper"

# The calendar draws the real time when it is known, the planned one otherwise.
class TimeBlockDisplayedTimeTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "displayed-time@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    @block = @user.time_blocks.create!(
      title: "Rédaction", category: "work",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
  end

  test "without real times the planned slot is shown" do
    assert_equal @block.start_at, @block.displayed_start_at
    assert_equal @block.end_at, @block.displayed_end_at
    assert_not @block.shows_actual_time?
  end

  test "real start and end replace the planned slot" do
    @block.update!(actual_start_clock: "09:10", actual_end_clock: "11:40")

    assert_equal Time.zone.local(2026, 11, 2, 9, 10), @block.displayed_start_at
    assert_equal Time.zone.local(2026, 11, 2, 11, 40), @block.displayed_end_at
    assert @block.shows_actual_time?
  end

  test "a real start alone keeps the planned length" do
    @block.update!(actual_start_clock: "09:30")

    assert_equal Time.zone.local(2026, 11, 2, 10, 30), @block.displayed_end_at
  end

  test "a block has started once its displayed start has passed" do
    assert @block.started?(Time.zone.local(2026, 11, 2, 9, 0))
    assert_not @block.started?(Time.zone.local(2026, 11, 2, 8, 59))
  end

  test "real clocks keep their wall-clock time on daylight-saving days" do
    spring = @user.time_blocks.create!(
      title: "Changement d'heure", category: "work",
      start_at: Time.zone.local(2026, 3, 29, 9, 0),
      end_at: Time.zone.local(2026, 3, 29, 10, 0),
      actual_start_clock: "09:00", actual_end_clock: "10:30"
    )

    assert_equal "09:00", spring.displayed_start_at.strftime("%H:%M")
    assert_equal "10:30", spring.displayed_end_at.strftime("%H:%M")
    assert_equal spring.start_at, spring.displayed_start_at
  end
end
