class PlannerController < ApplicationController
  def index
    requested = begin
      Date.iso8601(params.fetch(:week, Date.current.iso8601))
    rescue Date::Error
      Date.current
    end
    @week_start = requested.beginning_of_week(:monday)
    @days = (0..6).map { |offset| @week_start + offset }
    @blocks = current_user.time_blocks
      .where(start_at: @week_start.in_time_zone...(@week_start + 7).in_time_zone)
      .order(:start_at).to_a
    @blocks_by_day = @blocks.group_by { |block| block.start_at.in_time_zone.to_date }
    @planned_minutes = @blocks.sum(&:duration_minutes)
    @actual_minutes = @blocks.sum { |block| block.actual_minutes.to_i }

    # Extend the visible grid for early or late blocks rather than
    # displaying them at the wrong hour.
    @calendar_start_hour = ([7] + @blocks.map { |block| block.start_at.in_time_zone.hour }).min
    latest_hours = @blocks.map do |block|
      finish = block.end_at.in_time_zone
      finish.hour + (finish.min.positive? || finish.sec.positive? ? 1 : 0)
    end
    @calendar_end_hour = ([21] + latest_hours).max
    @calendar_height = (@calendar_end_hour - @calendar_start_hour) * 66
  end
end
