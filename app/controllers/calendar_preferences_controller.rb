# Calendar settings: first visible hour and interface language.
class CalendarPreferencesController < ApplicationController
  def update
    hour = Integer(params[:calendar_start_hour], exception: false)
    locale = params[:locale].presence || current_user.locale

    unless User::CALENDAR_START_HOURS.cover?(hour)
      return redirect_to planning_path, alert: t("calendar_preferences.flash.invalid_hour")
    end
    unless User::LOCALES.include?(locale)
      return redirect_to planning_path, alert: t("calendar_preferences.flash.invalid_locale")
    end

    current_user.update!(calendar_start_hour: hour, locale: locale)
    # The confirmation is shown in the language just chosen.
    redirect_to planning_path, notice: t("calendar_preferences.flash.saved", locale: locale)
  end

  private

  # Keep the same week and selected day when returning to the calendar.
  def planning_path
    root_path(week: params[:week], day: params[:day])
  end
end
