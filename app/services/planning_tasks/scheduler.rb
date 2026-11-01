module PlanningTasks
  # Turn an unscheduled task into one calendar block, atomically.
  #
  # The task remains the source of intent. Its estimated duration is used
  # unchanged; any invalid placement leaves the task in the inbox.
  class Scheduler
    Result = Struct.new(:block, :error, :overlap, keyword_init: true) do
      def success?
        block.present?
      end
    end

    def initialize(task:, date:, clock:)
      @task = task
      @date = date.to_s
      @clock = clock.to_s
    end

    def call
      date = parse_date
      clock = @clock.match(/\A([01]\d|2[0-3]):(00|15|30|45)\z/)
      return Result.new(error: "Choisissez un jour et une heure par quart d'heure.") unless date && clock

      starts_at = Time.zone.local(date.year, date.month, date.day,
                                  clock[1].to_i, clock[2].to_i)
      ends_at = starts_at + @task.estimated_minutes.minutes

      if ends_at.in_time_zone.to_date != date
        return Result.new(error: "Cette activité dépasse minuit. Choisissez une heure plus tôt.")
      end

      @task.with_lock do
        if @task.scheduled?
          Result.new(error: "Cette activité est déjà planifiée.")
        else
          reserve(starts_at, ends_at)
        end
      end
    end

    private

    def reserve(starts_at, ends_at)
      block = @task.user.time_blocks.new(
        title: @task.title,
        category: @task.category,
        notes: @task.notes,
        tags: @task.tags,
        actual_minutes: @task.actual_minutes,
        start_at: starts_at,
        end_at: ends_at
      )

      unless block.valid?
        return Result.new(error: block.errors.full_messages.to_sentence)
      end

      overlaps = @task.user.time_blocks
                      .where("start_at < ? AND end_at > ?", ends_at, starts_at)
                      .exists?

      block.save!
      @task.update!(scheduled_block: block)
      Result.new(block: block, overlap: overlaps)
    end

    def parse_date
      return nil unless @date.match?(/\A\d{4}-\d{2}-\d{2}\z/)

      Date.iso8601(@date)
    rescue Date::Error, ArgumentError
      nil
    end
  end
end
