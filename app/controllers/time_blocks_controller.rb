class TimeBlocksController < ApplicationController
  MAX_PLANNED_MINUTES = 960
  MAX_ACTUAL_MINUTES = 24 * 60 - 1
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
    copy_actual_times_from_task

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
    @edits_actual = @block.started?
    load_schedule_from_block
  end

  def update
    # Decided before any change: once a block has started, the form edits
    # what really happened and the plan stays as it was created.
    @edits_actual = @block.started?
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
    params.require(:time_block).permit(:title, :category, :notes)
  end

  # A pending task can carry real times (it was returned to the inbox after
  # being worked on): scheduling it again keeps them.
  def copy_actual_times_from_task
    return unless @planning_task

    @block.actual_start_clock = @planning_task.actual_start_clock
    @block.actual_end_clock = @planning_task.actual_end_clock
    @block.actual_minutes = @planning_task.actual_minutes
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

  # The form shows what the calendar draws: real times once a block has
  # started (see @edits_actual), planned times before.
  def load_schedule_from_block
    @schedule_date = @block.start_at.in_time_zone.to_date.iso8601
    if @edits_actual
      @start_clock, @duration_minutes = displayed_wall_clock
    else
      start = @block.start_at.in_time_zone
      @start_clock = start.strftime("%H:%M")
      @duration_minutes = wall_clock_minutes(start, @block.end_at.in_time_zone)
    end
  end

  # Minutes between two times as read on the clock, so a daylight-saving day
  # shows the same length as the form counts (01:00–04:00 is 180 min).
  def wall_clock_minutes(start, finish)
    days = (finish.to_date - start.to_date).to_i
    days * 24 * 60 + (finish.hour * 60 + finish.min) - (start.hour * 60 + start.min)
  end

  # The drawn start and its length in wall-clock minutes, as the form counts
  # them: a daylight-saving day shows the real clocks, and an end clipped at
  # midnight stays on the same day (23:59).
  def displayed_wall_clock
    start = @block.displayed_start_at.in_time_zone
    finish = @block.displayed_end_at.in_time_zone
    minutes = (finish.hour * 60 + finish.min) - (start.hour * 60 + start.min)
    [start.strftime("%H:%M"), [minutes, 1].max]
  end

  def apply_schedule_params
    schedule = params.require(:time_block).permit(:schedule_date, :start_clock, :duration_minutes)
    @schedule_date = schedule[:schedule_date].to_s
    @start_clock = schedule[:start_clock].to_s
    @duration_minutes = schedule[:duration_minutes].to_s

    day = safe_day(@schedule_date)
    clock_match = @start_clock.match(/\A([01]\d|2[0-3]):([0-5]\d)\z/)
    duration = Integer(@duration_minutes, exception: false)

    # A plan lasts at most 16 h; real times may fill the whole day.
    longest = @edits_actual ? MAX_ACTUAL_MINUTES : MAX_PLANNED_MINUTES
    unless day && clock_match && duration && duration.between?(1, longest)
      @block.errors.add(:base, t("time_blocks.errors.invalid_schedule"))
      return false
    end

    start_time = Time.zone.local(day.year, day.month, day.day,
                                 clock_match[1].to_i, clock_match[2].to_i)
    return apply_actual_schedule(day, start_time, duration) if @edits_actual

    @block.start_at = start_time
    @block.end_at = wall_clock_end(day, start_time, duration)
    true
  end

  # The end the form shows: start clock plus the duration in clock minutes,
  # so 01:00 + 180 min ends at 04:00 even on a daylight-saving day.
  def wall_clock_end(day, start_time, duration)
    end_minutes = start_time.hour * 60 + start_time.min + duration
    end_day = day + end_minutes / (24 * 60)
    minute_of_day = end_minutes % (24 * 60)
    Time.zone.local(end_day.year, end_day.month, end_day.day,
                    minute_of_day / 60, minute_of_day % 60)
  end

  # For a block that has started: the form's start and duration become the
  # real times, only when they were changed, so editing just the title never
  # invents real times. Another day moves the plan too, with the same clocks.
  def apply_actual_schedule(day, start_time, duration)
    shown_start, shown_minutes = displayed_wall_clock

    days_moved = (day - @block.start_at.in_time_zone.to_date).to_i
    if days_moved != 0
      @block.start_at += days_moved.days
      @block.end_at += days_moved.days
    end
    return true if @start_clock == shown_start && duration == shown_minutes

    # Wall-clock minutes, as in the form: on a daylight-saving day the end
    # entered is the end saved.
    end_minutes = start_time.hour * 60 + start_time.min + duration
    if end_minutes >= 24 * 60
      @block.errors.add(:base, t("time_blocks.errors.past_midnight"))
      return false
    end
    @block.actual_start_clock = @start_clock
    @block.actual_end_clock = format("%02d:%02d", end_minutes / 60, end_minutes % 60)
    true
  end
end
