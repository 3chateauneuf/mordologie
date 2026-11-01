class PlanningTasksController < ApplicationController
  before_action :load_task, only: [:destroy, :schedule]

  def create
    @task = current_user.planning_tasks.new(task_params)

    if @task.save
      redirect_to return_to_calendar, notice: "Ajouté aux choses à planifier."
    else
      redirect_to return_to_calendar, alert: @task.errors.full_messages.to_sentence
    end
  end

  # Dragging onto a calendar slot directly schedules the task.
  # The server, not the browser, chooses its trusted title and duration.
  def schedule
    result = PlanningTasks::Scheduler.new(
      task: @task,
      date: params[:schedule_date],
      clock: params[:start_clock]
    ).call

    unless result.success?
      return redirect_to return_to_calendar, alert: result.error
    end

    day = result.block.start_at.in_time_zone.to_date.iso8601
    message = "Activité planifiée."
    message += " Attention : ce créneau chevauche une autre activité." if result.overlap
    redirect_to root_path(week: day, day: day), notice: message
  end

  def destroy
    if @task.scheduled?
      redirect_to return_to_calendar, alert: "Retirez d'abord cette activité du planning."
    else
      @task.destroy!
      redirect_to return_to_calendar, notice: "Tâche supprimée."
    end
  end

  private

  def load_task
    @task = current_user.planning_tasks.find(params[:id])
  end

  def task_params
    params.require(:planning_task).permit(:title, :category, :estimated_minutes, :notes)
  end

  def return_to_calendar
    # Only dates are accepted; URLs are never taken from the request.
    week = valid_day(params[:week])
    day = valid_day(params[:day])
    root_path(week: week&.iso8601, day: day&.iso8601)
  end

  def valid_day(value)
    return nil unless value.to_s.match?(/\A\d{4}-\d{2}-\d{2}\z/)

    Date.iso8601(value)
  rescue Date::Error, ArgumentError
    nil
  end
end
