class TimeBlocksController < ApplicationController
  before_action :find_block, only: [:edit, :update, :destroy, :return_to_inbox, :reschedule]
  before_action :load_tag_suggestions, only: [:new, :create, :edit, :update]
  before_action :load_planning_task, only: [:new, :create]

  def new
    day = safe_day(params[:day]) || Date.current
    hour = params.fetch(:hour, 9).to_i.clamp(0, 23)
    minute = params.fetch(:minute, 0).to_i.clamp(0, 59)
    requested_duration = params.fetch(:duration, @planning_task&.estimated_minutes || 60).to_i.clamp(1, 960)
    start_time = Time.zone.local(day.year, day.month, day.day, hour, minute)
    last_time = Time.zone.local(day.year, day.month, day.day, 23, 59)
    available_minutes = [((last_time - start_time) / 60).floor, 1].max
    duration = [requested_duration, available_minutes].min

    @block = current_user.time_blocks.new(
      start_at: start_time,
      end_at: start_time + duration.minutes,
      category: @planning_task&.category || "travail",
      title: @planning_task&.title,
      notes: @planning_task&.notes,
      tags: @planning_task&.tags || [],
      actual_minutes: @planning_task&.actual_minutes
    )
    load_schedule_from_block
  end

  def create
    @block = current_user.time_blocks.new(block_details)
    @block.tag_list = submitted_tag_list

    if apply_schedule_params && @block.valid? && save_with_optional_task
      day = @block.start_at.in_time_zone.to_date.iso8601
      redirect_to root_path(week: day, day: day), notice: "Créneau ajouté."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    load_schedule_from_block
  end

  def update
    @block.assign_attributes(block_details)
    @block.tag_list = submitted_tag_list
    if apply_schedule_params && @block.save
      redirect_to root_path(week: @block.start_at.in_time_zone.to_date.iso8601, day: @block.start_at.in_time_zone.to_date.iso8601), notice: "Créneau mis à jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    day = @block.start_at.in_time_zone.to_date.iso8601
    linked_task = @block.planning_task

    if linked_task
      PlanningTasks::ReturnToInbox.new(block: @block).call
    else
      @block.destroy!
    end

    notice = linked_task ? "Activité remise en attente." : "Créneau supprimé."
    redirect_to root_path(week: day, day: day), notice: notice
  end

  def reschedule
    previous_day = @block.start_at.in_time_zone.to_date.iso8601
    result = TimeBlocks::Rescheduler.new(
      block: @block,
      date: params[:schedule_date],
      clock: params[:start_clock]
    ).call

    unless result.success?
      return redirect_to root_path(week: previous_day, day: previous_day),
                         alert: result.error
    end

    selected_day = result.block.start_at.in_time_zone.to_date.iso8601
    notice = "Créneau déplacé."
    notice += " Attention : ce créneau chevauche une autre activité." if result.overlap
    redirect_to root_path(week: selected_day, day: selected_day), notice: notice
  end

  def return_to_inbox
    block_day = @block.start_at.in_time_zone.to_date
    selected_day = safe_day(params[:day]) || block_day
    selected_week = safe_day(params[:week]) || block_day

    PlanningTasks::ReturnToInbox.new(block: @block).call

    redirect_to root_path(week: selected_week.iso8601, day: selected_day.iso8601),
                notice: "Activité remise en attente."
  end

  private

  def load_planning_task
    return if params[:planning_task_id].blank?

    @planning_task = current_user.planning_tasks.find(params[:planning_task_id])
  end

  def save_with_optional_task
    return @block.save unless @planning_task

    # Lock the task before creating a reservation: two browser tabs must
    # not be able to schedule the same pending item twice.
    @planning_task.with_lock do
      if @planning_task.scheduled?
        @block.errors.add(:base, "Cette activité est déjà planifiée.")
        next false
      end

      @block.save!
      @planning_task.update!(scheduled_block: @block)
      true
    end
  end

  def find_block
    @block = current_user.time_blocks.find(params[:id])
  end

  # Start/end timestamps are always calculated on the server, never
  # mass-assigned from a browser form.
  def block_details
    params.require(:time_block).permit(:title, :category, :notes, :actual_minutes)
  end

  def submitted_tag_list
    params.require(:time_block).fetch(:tag_list, "").to_s
  end

  def load_tag_suggestions
    @suggested_tags = current_user.time_blocks.pluck(:tags).flatten.uniq.sort.take(20)
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
