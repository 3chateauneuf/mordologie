module PlannerHelper
  # Display exact tracked minutes instead of rounding fractions of hours.
  # E.g. 15 minutes should never be shown as "0.3 h".
  def planner_duration(total_minutes)
    hours, minutes = total_minutes.to_i.divmod(60)
    return "#{minutes} min" if hours.zero?
    return "#{hours} h" if minutes.zero?
    "#{hours} h #{minutes.to_s.rjust(2, '0')}"
  end
end
