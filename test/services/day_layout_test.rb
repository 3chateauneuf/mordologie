require "test_helper"

class DayLayoutTest < ActiveSupport::TestCase
  DAY = Date.new(2026, 11, 2)

  setup do
    @user = User.create!(
      email: "day-layout@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
  end

  test "blocks that do not overlap use the full width" do
    first = block("Matin", "09:00", "10:00")
    second = block("Suite", "10:00", "11:00")

    lanes = lanes_for([first, second])
    assert_equal [0, 1], lanes[first]
    assert_equal [0, 1], lanes[second]
  end

  test "overlapping blocks split the column" do
    long = block("Long", "09:00", "12:00")
    meeting = block("Réunion", "10:00", "11:00")
    later = block("Après", "11:30", "12:30")

    lanes = lanes_for([long, meeting, later])
    assert_equal [0, 2], lanes[long]
    assert_equal [1, 2], lanes[meeting]
    assert_equal [1, 2], lanes[later]
  end

  test "a real end that runs over makes the blocks overlap" do
    first = block("Montage", "09:00", "10:00")
    first.update!(actual_start_clock: "09:00", actual_end_clock: "10:40")
    second = block("Appel", "10:00", "10:30")

    lanes = lanes_for([first, second])
    assert_equal [0, 2], lanes[first]
    assert_equal [1, 2], lanes[second]
  end

  test "the planned slot is outlined when the real one differs" do
    first = block("Montage", "09:00", "10:00")
    first.update!(actual_start_clock: "09:00", actual_end_clock: "10:40")

    entry = layout([first]).entries.first
    assert entry.planned_ghost?
    assert_equal "10:40", entry.end_label
  end

  test "only the latest started block of today offers to finish now" do
    morning = block("Matin", "09:00", "10:00")
    current = block("En cours", "10:00", "11:00")
    future = block("Plus tard", "15:00", "16:00")

    entries = layout([morning, current, future], now: Time.zone.local(2026, 11, 2, 11, 30)).entries
    assert_equal ["En cours"], entries.select(&:finish_now?).map { |entry| entry.block.title }
  end

  private

  def block(title, starts, ends)
    @user.time_blocks.create!(
      title: title, category: "travail",
      start_at: Time.zone.parse("#{DAY} #{starts}"),
      end_at: Time.zone.parse("#{DAY} #{ends}")
    )
  end

  def layout(blocks, now: Time.zone.local(2026, 11, 3, 8, 0))
    PlannerCalendar::DayLayout.new(blocks: blocks, day: DAY, start_hour: 6,
                                   calendar_height: 15 * 66, now: now)
  end

  def lanes_for(blocks)
    layout(blocks).entries.to_h { |entry| [entry.block, [entry.lane, entry.lanes]] }
  end
end
