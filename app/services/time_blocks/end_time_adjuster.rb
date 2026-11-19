module TimeBlocks
  # Change when a block ends, from the calendar itself.
  #
  # - A block that has already started gets a real end.
  #   If no real start was entered, the planned start is used.
  # - A future block is still a plan: its planned end moves instead.
  #
  # Invalid values never modify the stored block.
  class EndTimeAdjuster
    Result = Struct.new(:block, :error, :kind, keyword_init: true) do
      def success?
        error.nil?
      end
    end

    def initialize(block:, end_clock: nil, finish_now: false, now: Time.current)
      @block = block
      @end_clock = end_clock.to_s
      @finish_now = finish_now
      @now = now.in_time_zone
    end

    def call
      if @finish_now && @block.start_at.in_time_zone.to_date != @now.to_date
        return Result.new(error: I18n.t("time_blocks.errors.finish_now_today_only"))
      end

      clock = @finish_now ? WallClock.of(@now) : @end_clock
      return Result.new(error: I18n.t("time_blocks.errors.end_clock_format")) unless WallClock.minutes(clock)

      @block.with_lock do
        @block.started?(@now) ? set_actual_end(clock) : set_planned_end(clock)
      end
    end

    private

    def set_actual_end(clock)
      @block.actual_start_clock = WallClock.of(@block.start_at) if @block.actual_start_clock.blank?
      @block.actual_end_clock = clock
      save(:actual)
    end

    def set_planned_end(clock)
      @block.end_at = WallClock.at(@block.start_at.in_time_zone.to_date, WallClock.minutes(clock))
      save(:planned)
    end

    def save(kind)
      if @block.save
        Result.new(block: @block, kind: kind)
      else
        error = @block.errors.full_messages.to_sentence
        @block.restore_attributes
        Result.new(error: error)
      end
    end
  end
end
