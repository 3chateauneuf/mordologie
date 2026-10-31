class CalendarPreferencesController < ApplicationController
  def update
    hour = Integer(params[:calendar_start_hour], exception: false)

    if User::CALENDAR_START_HOURS.cover?(hour)
      current_user.update!(calendar_start_hour: hour)
      redirect_to planning_path, notice: "Heure de début enregistrée."
    else
      redirect_to planning_path, alert: "Choisissez une heure entre 00:00 et 23:00."
    end
  end

  private

  # Keep the same week and selected day when returning to the calendar.
  def planning_path
    root_path(week: params[:week], day: params[:day])
  end
end
