class TimeBlocksController < ApplicationController
  before_action :find_block, only: [:edit, :update, :destroy, :return_to_inbox, :reschedule, :end_time, :duplicate]
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
      actual_minutes: @planning_task&.actual_minutes,
      actual_start_clock: @planning_task&.actual_start_clock,
      actual_end_clock: @planning_task&.actual_end_clock
    )
    load_schedule_from_block
  end

  def create
    @block = current_user.time_blocks.new(block_details)
    @block.tag_list = submitted_tag_list

    if apply_schedule_params && @block.valid? && save_with_optional_task
      # Scheduling a pending task is not undoable here (it would send the task
      # back to the inbox); a plain new block is.
      history.record("create", @block, before: nil) unless @planning_task
      day = @block.start_at.in_time_zone.to_date.iso8601
      redirect_to root_path(week: day, day: day), notice: t("time_blocks.flash.created")
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
      redirect_to root_path(week: @block.start_at.in_time_zone.to_date.iso8601, day: @block.start_at.in_time_zone.to_date.iso8601), notice: t("time_blocks.flash.updated")
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE always means permanent deletion, including any linked task.
  # Returning to the inbox has its own explicit action and endpoint.
  def destroy
    day = @block.start_at.in_time_zone.to_date.iso8601
    TimeBlocks::DeletePermanently.new(block: @block).call

    redirect_to root_path(week: day, day: day),
                notice: t("time_blocks.flash.deleted")
  end

  def reschedule
    previous_day = @block.start_at.in_time_zone.to_date.iso8601
    before = BlockHistory.snapshot(@block)
    result = TimeBlocks::Rescheduler.new(
      block: @block,
      date: params[:schedule_date],
      clock: params[:start_clock]
    ).call

    unless result.success?
      return redirect_to root_path(week: previous_day, day: previous_day),
                         alert: result.error
    end

    history.record("move", result.block, before: before)
    selected_day = result.block.start_at.in_time_zone.to_date.iso8601
    notice = t("time_blocks.flash.moved")
    notice += " #{t('time_blocks.flash.overlap')}" if result.overlap
    redirect_to root_path(week: selected_day, day: selected_day), notice: notice
  end

  # Quick end-time changes from the calendar: inline edit, "+15 / +30 / +1 h",
  # resizing the block, or "Terminer maintenant".
  def end_time
    before = BlockHistory.snapshot(@block)
    result = TimeBlocks::EndTimeAdjuster.new(
      block: @block,
      end_clock: params[:end_clock],
      finish_now: params[:finish_now] == "1"
    ).call

    day = @block.start_at.in_time_zone.to_date.iso8601
    if result.success?
      history.record("resize", result.block, before: before)
      kind = t(result.kind == :actual ? "planner.calendar_event.end_actual" : "planner.calendar_event.end_planned")
      redirect_to root_path(week: day, day: day),
                  notice: t("time_blocks.flash.end_saved", kind: kind,
                            time: result.block.displayed_end_at.in_time_zone.strftime("%H:%M"))
    else
      redirect_to root_path(week: day, day: day), alert: result.error
    end
  end

  # Shift + drag in the calendar: a copy at the drop position.
  def duplicate
    result = TimeBlocks::Duplicator.new(
      block: @block, date: params[:schedule_date], clock: params[:start_clock]
    ).call

    if result.success?
      history.record("duplicate", result.block, before: nil)
      day = result.block.start_at.in_time_zone.to_date.iso8601
      redirect_to root_path(week: day, day: day), notice: t("time_blocks.flash.duplicated")
    else
      day = @block.start_at.in_time_zone.to_date.iso8601
      redirect_to root_path(week: day, day: day), alert: result.error
    end
  end

  def return_to_inbox
    block_day = @block.start_at.in_time_zone.to_date
    selected_day = safe_day(params[:day]) || block_day
    selected_week = safe_day(params[:week]) || block_day

    PlanningTasks::ReturnToInbox.new(block: @block).call

    redirect_to root_path(week: selected_week.iso8601, day: selected_day.iso8601),
                notice: t("time_blocks.flash.returned_to_inbox")
  end

  private

  def history
    @history ||= BlockHistory.new(current_user)
  end

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
        @block.errors.add(:base, t("time_blocks.errors.already_scheduled"))
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
    params.require(:time_block).permit(:title, :category, :notes,
                                       :actual_start_clock, :actual_end_clock)
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
      @block.errors.add(:base, t("time_blocks.errors.invalid_schedule"))
      return false
    end

    start_time = Time.zone.local(day.year, day.month, day.day,
                                 clock_match[1].to_i, clock_match[2].to_i)
    @block.start_at = start_time
    @block.end_at = start_time + duration.minutes
    true
  end
end
