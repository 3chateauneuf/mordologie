module TimeBlocks
  # Move a reservation without changing its durations, owner or contents.
  #
  # The drop position is where the block is drawn: its real start when one
  # was recorded, otherwise its planned start. The planned slot and the real
  # times all shift by the same amount, so every duration stays the same.
  #
  # Invalid placements never modify the stored time block.
  class Rescheduler
    MINUTES_PER_DAY = 24 * 60

    Result = Struct.new(:block, :error, :overlap, keyword_init: true) do
      def success?
        error.nil?
      end
    end

    def initialize(block:, date:, clock:)
      @block = block
      @date = date.to_s
      @clock = clock.to_s
    end

    def call
      date = parse_date
      time_match = @clock.match(/\A([01]\d|2[0-3]):(00|15|30|45)\z/)
      return Result.new(error: "Choisissez une date et une heure par quart d'heure.") unless date && time_match

      drop_minutes = time_match[1].to_i * 60 + time_match[2].to_i
      @block.with_lock { move(date, drop_minutes) }
    end

    private

    def move(date, drop_minutes)
      shift = drop_minutes - minutes_of_day(@block.displayed_start_at)
      planned_start = minutes_of_day(@block.start_at) + shift
      planned_end = planned_start + @block.duration_minutes
      actual_start = shifted_clock(@block.actual_start_clock, shift)
      actual_end = shifted_clock(@block.actual_end_clock, shift)

      if planned_start.negative? || planned_end >= MINUTES_PER_DAY ||
         actual_start == :outside_day || actual_end == :outside_day
        return Result.new(error: "Ce créneau dépasse minuit. Choisissez une heure plus tôt.")
      end

      start_at = local_time(date, planned_start)
      # Elapsed time, not wall-clock: the planned duration stays the same
      # even on the days when the clocks change.
      end_at = start_at + @block.duration_minutes.minutes
      if end_at.in_time_zone.to_date != date
        return Result.new(error: "Ce créneau dépasse minuit. Choisissez une heure plus tôt.")
      end
      return Result.new(block: @block, overlap: false) if start_at == @block.start_at

      @block.assign_attributes(
        start_at: start_at,
        end_at: end_at,
        actual_start_clock: actual_start,
        actual_end_clock: actual_end
      )
      unless @block.valid?
        return Result.new(error: @block.errors.full_messages.to_sentence)
      end

      @block.save!
      Result.new(block: @block, overlap: overlaps_another_block?)
    end

    # A recorded real clock moves with the block; an empty one stays empty.
    def shifted_clock(clock, shift)
      return clock if clock.blank?

      hours, minutes = clock.split(":").map(&:to_i)
      total = hours * 60 + minutes + shift
      return :outside_day unless total.between?(0, MINUTES_PER_DAY - 1)

      format("%02d:%02d", total / 60, total % 60)
    end

    def overlaps_another_block?
      @block.user.time_blocks
            .where.not(id: @block.id)
            .where("start_at < ? AND end_at > ?", @block.end_at, @block.start_at)
            .exists?
    end

    def minutes_of_day(time)
      local = time.in_time_zone
      local.hour * 60 + local.min
    end

    # Built from date + clock so that daylight-saving days keep wall-clock times.
    def local_time(date, minutes)
      Time.zone.local(date.year, date.month, date.day, minutes / 60, minutes % 60)
    end

    def parse_date
      return nil unless @date.match?(/\A\d{4}-\d{2}-\d{2}\z/)

      Date.iso8601(@date)
    rescue Date::Error, ArgumentError
      nil
    end
  end
end
