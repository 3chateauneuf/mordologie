# Times of day written "HH:MM", as people read them on a wall clock.
#
#   WallClock.minutes("09:30")         # => 570   (nil if not a valid time)
#   WallClock.clock(570)               # => "09:30"
#   WallClock.of(time)                 # => "09:30"
#   WallClock.minute_of_day(time)      # => 570
#   WallClock.at(date, 570)            # => that date at 09:30, in Time.zone
#   WallClock.minutes_between(a, b)    # => clock minutes from a to b
#
# Times are always built from a date and a clock (never "midnight + n
# minutes"), so on the days when the clocks change, 09:30 stays 09:30.
module WallClock
  PATTERN = /\A([01]\d|2[0-3]):([0-5]\d)\z/
  MINUTES_PER_DAY = 24 * 60

  def self.minutes(clock)
    match = PATTERN.match(clock.to_s)
    match && match[1].to_i * 60 + match[2].to_i
  end

  def self.clock(minutes)
    format("%02d:%02d", minutes / 60, minutes % 60)
  end

  def self.of(time)
    time.in_time_zone.strftime("%H:%M")
  end

  def self.minute_of_day(time)
    local = time.in_time_zone
    local.hour * 60 + local.min
  end

  # Minutes past a day's end continue on the following day.
  def self.at(date, minutes)
    day = date + minutes / MINUTES_PER_DAY
    minute_of_day = minutes % MINUTES_PER_DAY
    Time.zone.local(day.year, day.month, day.day, minute_of_day / 60, minute_of_day % 60)
  end

  # Read on the clock, not elapsed: 01:00–04:00 is 180 minutes even on the
  # night the clocks go forward.
  def self.minutes_between(start, finish)
    days = (finish.in_time_zone.to_date - start.in_time_zone.to_date).to_i
    days * MINUTES_PER_DAY + minute_of_day(finish) - minute_of_day(start)
  end
end
