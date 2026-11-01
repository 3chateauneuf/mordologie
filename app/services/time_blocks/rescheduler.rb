module TimeBlocks
  # Move a reservation without changing its duration, owner or contents.
  # Invalid placements never modify the stored time block.
  class Rescheduler
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

      start_at = Time.zone.local(date.year, date.month, date.day,
                                 time_match[1].to_i, time_match[2].to_i)
      @block.with_lock { move(start_at, date) }
    end

    private

    def move(start_at, date)
      ends_at = start_at + @block.duration_minutes.minutes

      if ends_at.in_time_zone.to_date != date
        return Result.new(error: "Ce créneau dépasse minuit. Choisissez une heure plus tôt.")
      end

      return Result.new(block: @block, overlap: false) if start_at == @block.start_at

      @block.assign_attributes(start_at: start_at, end_at: ends_at)
      unless @block.valid?
        return Result.new(error: @block.errors.full_messages.to_sentence)
      end

      overlap = @block.user.time_blocks
                      .where.not(id: @block.id)
                      .where("start_at < ? AND end_at > ?", ends_at, start_at)
                      .exists?
      @block.save!
      Result.new(block: @block, overlap: overlap)
    end

    def parse_date
      return nil unless @date.match?(/\A\d{4}-\d{2}-\d{2}\z/)

      Date.iso8601(@date)
    rescue Date::Error, ArgumentError
      nil
    end
  end
end
