class TimeBlocksController < ApplicationController
  # The times in the dialog (plan or real, clock minutes) are handled by
  # TimeBlocks::ScheduleForm; this controller only receives and answers.
  before_action :find_block, only: [:edit, :update, :destroy, :return_to_inbox, :reschedule, :end_time, :duplicate]
  before_action :load_tag_suggestions, only: [:new, :create, :edit, :update]
  before_action :load_planning_task, only: [:new, :create]

  def new
    day = safe_day(params[:day]) || Date.current
    hour = params.fetch(:hour, 9).to_i.clamp(0, 23)
    minute = params.fetch(:minute, 0).to_i.clamp(0, 59)
    requested_duration = params.fetch(:duration, @planning_task&.estimated_minutes || 60).to_i.clamp(1, 16 * 60)
    start_time = WallClock.at(day, hour * 60 + minute)
    last_time = WallClock.at(day, WallClock::MINUTES_PER_DAY - 1)
    available_minutes = [((last_time - start_time) / 60).floor, 1].max
    duration = [requested_duration, available_minutes].min

    @block = current_user.time_blocks.new(
      start_at: start_time,
      end_at: start_time + duration.minutes,
      category: @planning_task&.category || TimeBlock::DEFAULT_CATEGORY,
      title: @planning_task&.title,
      notes: @planning_task&.notes,
      tags: @planning_task&.tags || [],
      actual_minutes: @planning_task&.actual_minutes,
      actual_start_clock: @planning_task&.actual_start_clock,
      actual_end_clock: @planning_task&.actual_end_clock
    )
    @schedule = TimeBlocks::ScheduleForm.new(@block, edits_actual: false)
  end

  def create
    @block = current_user.time_blocks.new(block_details)
    @block.tag_list = submitted_tag_list
    copy_actual_times_from_task
    @schedule = TimeBlocks::ScheduleForm.new(@block, edits_actual: false)

    if apply_schedule && @block.valid? && save_with_optional_task
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
    @schedule = TimeBlocks::ScheduleForm.new(@block, edits_actual: @block.started?)
  end

  def update
    # Decided before any change: once a block has started, the form edits
    # what really happened and the plan stays as it was created.
    @schedule = TimeBlocks::ScheduleForm.new(@block, edits_actual: @block.started?)
    @block.assign_attributes(block_details)
    @block.tag_list = submitted_tag_list

    if started_while_open?
      # Show the real times instead of reading planned values as what
      # really happened.
      @block.errors.add(:base, t("time_blocks.errors.started_meanwhile"))
      render :edit, status: :unprocessable_entity
    elsif apply_schedule && @block.save
      day = @block.start_at.in_time_zone.to_date.iso8601
      redirect_to root_path(week: day, day: day), notice: t("time_blocks.flash.updated")
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
  # resizing the block, or "finish now".
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
                            time: WallClock.of(result.block.displayed_end_at))
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

  # The dialog sends back which times it showed (plan or real). If the block
  # started in the meantime, saving would write them into the other set.
  def started_while_open?
    shown = params[:schedule_mode].presence
    shown.present? && shown != @schedule.mode
  end

  def apply_schedule
    submitted = params.require(:time_block).permit(:schedule_date, :start_clock, :duration_minutes)
    applied = @schedule.apply(date: submitted[:schedule_date],
                              start_clock: submitted[:start_clock],
                              duration_minutes: submitted[:duration_minutes])
    @block.errors.add(:base, t(@schedule.error)) unless applied
    applied
  end
end
