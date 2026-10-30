class TimeBlocksController < ApplicationController
  before_action :find_block, only: [:edit, :update, :destroy]

  def new
    day = safe_day(params[:day]) || Date.current
    hour = params.fetch(:hour, 9).to_i.clamp(0, 23)
    minute = params.fetch(:minute, 0).to_i.clamp(0, 59)
    requested_duration = params.fetch(:duration, 60).to_i.clamp(1, 960)
    start_time = Time.zone.local(day.year, day.month, day.day, hour, minute)
    last_time = Time.zone.local(day.year, day.month, day.day, 23, 59)
    available_minutes = [((last_time - start_time) / 60).floor, 1].max
    duration = [requested_duration, available_minutes].min

    @block = current_user.time_blocks.new(
      start_at: start_time,
      end_at: start_time + duration.minutes,
      category: "travail"
    )
    load_schedule_from_block
  end

  def create
    @block = current_user.time_blocks.new(block_details)
    if apply_schedule_params && @block.save
      redirect_to root_path(week: @block.start_at.in_time_zone.to_date.iso8601), notice: "Créneau ajouté."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    load_schedule_from_block
  end

  def update
    @block.assign_attributes(block_details)
    if apply_schedule_params && @block.save
      redirect_to root_path(week: @block.start_at.in_time_zone.to_date.iso8601), notice: "Créneau mis à jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    week = @block.start_at.in_time_zone.to_date.iso8601
    @block.destroy!
    redirect_to root_path(week: week), notice: "Créneau supprimé."
  end

  private

  def find_block
    @block = current_user.time_blocks.find(params[:id])
  end

  # Start/end timestamps are always calculated on the server, never
  # mass-assigned from a browser form.
  def block_details
    params.require(:time_block).permit(:title, :category, :notes, :actual_minutes)
  end

  def safe_day(value)
    return nil unless value.to_s.match?(/\A\d{4}-\d{2}-\d{2}\z/)
    Date.iso8601(value)
  rescue Date::Error, ArgumentError
    nil
  end

  def load_schedule_from_block
    start_time = @block.start_at.in_time_zone
    @schedule_date = start_time.to_date.iso8601
    @start_clock = start_time.strftime("%H:%M")
    @duration_minutes = @block.duration_minutes
  end

  def apply_schedule_params
    schedule = params.require(:time_block).permit(:schedule_date, :start_clock, :duration_minutes)
    @schedule_date = schedule[:schedule_date].to_s
    @start_clock = schedule[:start_clock].to_s
    @duration_minutes = schedule[:duration_minutes].to_s

    day = safe_day(@schedule_date)
    clock_match = @start_clock.match(/\A([01]\d|2[0-3]):([0-5]\d)\z/)
    duration = Integer(@duration_minutes, exception: false)

    unless day && clock_match && duration && duration.between?(1, 960)
      @block.errors.add(:base, "Indiquez une date, une heure de début et une durée valide (1 à 960 minutes).")
      return false
    end

    start_time = Time.zone.local(day.year, day.month, day.day,
                                 clock_match[1].to_i, clock_match[2].to_i)
    @block.start_at = start_time
    @block.end_at = start_time + duration.minutes
    true
  end
end
