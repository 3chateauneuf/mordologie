class PlannerController < ApplicationController
  def search
    @query = params[:q].to_s.strip.first(120)
    @tag = params[:tag].to_s.strip.downcase.first(40)
    @available_tags = current_user.time_blocks.pluck(:tags).flatten.uniq.sort
    @tag = "" unless @available_tags.include?(@tag)

    blocks = current_user.time_blocks
    if @query.present?
      pattern = "%#{ActiveRecord::Base.sanitize_sql_like(@query)}%"
      blocks = blocks.where(
        "time_blocks.title ILIKE :term OR COALESCE(time_blocks.notes, '') ILIKE :term OR EXISTS (SELECT 1 FROM unnest(time_blocks.tags) AS t WHERE t ILIKE :term)",
        term: pattern
      )
    end
    blocks = blocks.where("? = ANY(time_blocks.tags)", @tag) if @tag.present?
    @results = blocks.order(start_at: :desc).limit(100).to_a
  end

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
