module PlannerHelper
  # Display exact tracked minutes instead of rounding fractions of hours.
  # E.g. 15 minutes should never be shown as "0.3 h".
  def planner_duration(total_minutes)
    hours, minutes = total_minutes.to_i.divmod(60)
    return "#{minutes} min" if hours.zero?
    return "#{hours} h" if minutes.zero?
    "#{hours} h #{minutes.to_s.rjust(2, '0')}"
  end

  # Texts for the browser scripts (key "js" in config/locales), passed
  # through <body data-i18n> and read by public/scripts/i18n.js.
  def planner_js_translations
    I18n.t("js")
  end

  # "16 – 22 noviembre", or "27 oct. – 2 nov." when the week spans two months.
  def planner_week_range(week_start)
    week_end = week_start + 6
    if week_start.month == week_end.month
      "#{week_start.day} – #{I18n.l(week_end, format: '%-d %B')}"
    else
      "#{I18n.l(week_start, format: '%-d %b')} – #{I18n.l(week_end, format: '%-d %b')}"
    end
  end

  # Weekday name for a date in the current language: :short ("lun."),
  # :long ("lunes") or :letter ("L").
  def planner_weekday(date, style = :short)
    case style
    when :long then I18n.l(date, format: "%A").capitalize
    when :letter then I18n.l(date, format: "%a")[0].upcase
    else I18n.l(date, format: "%a").delete(".").capitalize
    end
  end
end
