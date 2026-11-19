module TimeBlocks
  # The times shown and saved by the block dialog: a date, a start clock and
  # a duration.
  #
  # The rule is "what you see is what you edit":
  # - before a block starts, the dialog shows and changes its plan;
  # - once it has started, it shows and changes what really happened
  #   (actual_start_clock / actual_end_clock), and the plan is kept as it
  #   was created.
  #
  # Durations are clock minutes, the way the dialog counts them: on the night
  # the clocks change, 01:00 + 180 min still ends at 04:00.
  #
  #   form = ScheduleForm.new(block, edits_actual: block.started?)
  #   form.date, form.start_clock, form.duration_minutes   # what to show
  #   form.apply(date: "2026-11-02", start_clock: "09:00", duration_minutes: "60")
  #   form.error                                             # I18n key when apply fails
  class ScheduleForm
    # The model allows a plan of 16 elapsed hours. On the night the clocks
    # go forward, those 16 hours read as 17 on the clock.
    MAX_PLANNED_MINUTES = 16 * 60 + 60
    # Real times may fill the whole day, up to 23:59.
    MAX_ACTUAL_MINUTES = WallClock::MINUTES_PER_DAY - 1

    attr_reader :date, :start_clock, :duration_minutes, :error

    def initialize(block, edits_actual:)
      @block = block
      @edits_actual = edits_actual
      load_from_block if block.start_at && block.end_at
    end

    def edits_actual?
      @edits_actual
    end

    # Sent back by the dialog, to notice a block that started while it was open.
    def mode
      @edits_actual ? "actual" : "planned"
    end

    def longest_duration
      @edits_actual ? MAX_ACTUAL_MINUTES : MAX_PLANNED_MINUTES
    end

    # Writes the submitted times on the block (without saving it).
    # Returns false, with #error set, when they cannot be used.
    def apply(date:, start_clock:, duration_minutes:)
      @date = date.to_s
      @start_clock = start_clock.to_s
      @duration_minutes = duration_minutes.to_s

      day = parse_date(@date)
      start_minutes = WallClock.minutes(@start_clock)
      duration = Integer(@duration_minutes, exception: false)
      unless day && start_minutes && duration&.between?(1, longest_duration)
        return fail_with("time_blocks.errors.invalid_schedule")
      end

      if @edits_actual
        apply_actual(day, start_minutes, duration)
      else
        apply_planned(day, start_minutes, duration)
      end
    end

    private

    def load_from_block
      @date = @block.start_at.in_time_zone.to_date.iso8601
      @start_clock, @duration_minutes = @edits_actual ? shown_actual : shown_plan
    end

    # The plan as the dialog shows it. A plan inside the repeated autumn hour
    # (02:30 CEST–02:00 CET) has no positive clock length, so it shows its
    # elapsed minutes instead.
    def shown_plan
      minutes = WallClock.minutes_between(@block.start_at, @block.end_at)
      minutes = @block.duration_minutes if minutes < 1
      [WallClock.of(@block.start_at), minutes]
    end

    # The times drawn in the calendar. An end clipped at midnight stays on the
    # same day (23:59).
    def shown_actual
      start = @block.displayed_start_at
      minutes = WallClock.minute_of_day(@block.displayed_end_at) - WallClock.minute_of_day(start)
      [WallClock.of(start), [minutes, 1].max]
    end

    def apply_planned(day, start_minutes, duration)
      # Unchanged times keep the stored plan exactly: a title-only edit never
      # rebuilds it, which matters on the days when the clocks change.
      return true if @block.persisted? && unchanged?(day, duration, shown_plan)

      @block.start_at = WallClock.at(day, start_minutes)
      @block.end_at = WallClock.at(day, start_minutes + duration)
      true
    end

    # Only changed times become real times, so editing just the title never
    # invents them. Another day moves the plan too, with the same clocks.
    def apply_actual(day, start_minutes, duration)
      unchanged = unchanged?(day, duration, shown_actual, any_day: true)

      days_moved = (day - block_day).to_i
      if days_moved != 0
        @block.start_at += days_moved.days
        @block.end_at += days_moved.days
      end
      return true if unchanged

      end_minutes = start_minutes + duration
      return fail_with("time_blocks.errors.past_midnight") if end_minutes >= WallClock::MINUTES_PER_DAY

      @block.actual_start_clock = @start_clock
      @block.actual_end_clock = WallClock.clock(end_minutes)
      true
    end

    def unchanged?(day, duration, shown, any_day: false)
      shown_start, shown_minutes = shown
      (any_day || day == block_day) && @start_clock == shown_start && duration == shown_minutes
    end

    def block_day
      @block.start_at.in_time_zone.to_date
    end

    def parse_date(value)
      return nil unless value.match?(/\A\d{4}-\d{2}-\d{2}\z/)

      Date.iso8601(value)
    rescue Date::Error, ArgumentError
      nil
    end

    def fail_with(key)
      @error = key
      false
    end
  end
end
