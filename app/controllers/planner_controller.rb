class PlannerController < ApplicationController
  def search
    @query = params[:q].to_s.strip[0, 120]
    @tag = params[:tag].to_s.strip.downcase[0, 40]
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
    requested_day = begin
      Date.iso8601(params.fetch(:day, "").to_s)
    rescue Date::Error, ArgumentError
      nil
    end
    @selected_day = if @days.include?(requested_day)
      requested_day
    elsif @days.include?(Date.current)
      Date.current
    else
      @week_start
    end
    @blocks = current_user.time_blocks
      .where(start_at: @week_start.in_time_zone...(@week_start + 7).in_time_zone)
      .order(:start_at).to_a
    @blocks_by_day = @blocks.group_by { |block| block.start_at.in_time_zone.to_date }
    @pending_tasks = current_user.planning_tasks.pending.order(created_at: :desc, id: :desc).to_a
    @planned_minutes = @blocks.sum(&:duration_minutes)
    # Planned and real minutes per day, for the day headings.
    @day_totals = @days.index_with do |day|
      blocks = @blocks_by_day.fetch(day, [])
      { planned: blocks.sum(&:duration_minutes), actual: blocks.sum { |block| block.actual_minutes.to_i } }
    end
    @actual_minutes = @blocks.sum { |block| block.actual_minutes.to_i }

    # Every day shows the whole 24 hours. The page opens scrolled to the
    # user's start hour, or to the current time (one hour of margin) in the
    # current week.
    @calendar_start_hour = 0
    @calendar_end_hour = 24
    @calendar_height = 24 * 66
    @scroll_hour = if @days.include?(Date.current)
      [Time.current.hour - 1, 0].max
    else
      current_user.calendar_start_hour
    end
    @day_layouts = @days.index_with do |day|
      PlannerCalendar::DayLayout.new(
        blocks: @blocks_by_day.fetch(day, []), day: day,
        start_hour: @calendar_start_hour, calendar_height: @calendar_height
      )
    end
  end
end
