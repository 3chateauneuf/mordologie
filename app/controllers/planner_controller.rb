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
  end
end
