module TimeBlocks
  # Copy a block to another slot (Shift + drag in the calendar).
  #
  # The copy keeps the title, category, notes and tags, and the length of the
  # block as drawn. It is a new plan: no real times are copied, and it is not
  # linked to a pending task.
  class Duplicator
    Result = Struct.new(:block, :error, keyword_init: true) do
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
      return Result.new(error: I18n.t("time_blocks.errors.quarter_hour")) unless date && time_match

      start_at = Time.zone.local(date.year, date.month, date.day,
                                 time_match[1].to_i, time_match[2].to_i)
      end_at = start_at + @block.displayed_duration_minutes.minutes
      if end_at.in_time_zone.to_date != date
        return Result.new(error: I18n.t("time_blocks.errors.past_midnight"))
      end

      copy = @block.user.time_blocks.new(
        title: @block.title, category: @block.category,
        notes: @block.notes, tags: @block.tags,
        start_at: start_at, end_at: end_at
      )
      return Result.new(error: copy.errors.full_messages.to_sentence) unless copy.save

      Result.new(block: copy)
    end

    private

    def parse_date
      return nil unless @date.match?(/\A\d{4}-\d{2}-\d{2}\z/)

      Date.iso8601(@date)
    rescue Date::Error, ArgumentError
      nil
    end
  end
end
