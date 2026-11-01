# Store the two observed clock times; derive actual_minutes on the server.
#
# An older entry may only have actual_minutes. Keep that value until somebody
# explicitly supplies a new clock pair; never invent clock times from a total.
module ActualTimeTracking
  extend ActiveSupport::Concern

  CLOCK_PATTERN = /\A(?:[01]\d|2[0-3]):[0-5]\d\z/

  included do
    before_validation :derive_actual_minutes
    validate :valid_actual_clock_pair
    validates :actual_minutes, numericality: {
      only_integer: true, greater_than_or_equal_to: 0
    }, allow_nil: true
  end

  private

  def clock_minutes(value)
    return nil unless value.to_s.match?(CLOCK_PATTERN)

    hours, minutes = value.split(":").map(&:to_i)
    hours * 60 + minutes
  end

  def derive_actual_minutes
    start_minutes = clock_minutes(actual_start_clock)
    end_minutes = clock_minutes(actual_end_clock)

    if start_minutes && end_minutes && end_minutes > start_minutes
      self.actual_minutes = end_minutes - start_minutes
    elsif actual_start_clock.blank? && actual_end_clock.blank? &&
          (attribute_in_database("actual_start_clock").present? ||
           attribute_in_database("actual_end_clock").present?)
      # Only erase a derived duration when previously stored clock times
      # have actually been cleared. HTML forms submit empty strings even for
      # older records whose database columns were NULL; those legacy
      # minute totals must survive unchanged.
      self.actual_minutes = nil
    end
  end

  def valid_actual_clock_pair
    first = actual_start_clock
    last = actual_end_clock
    return if first.blank? && last.blank?

    if first.blank? || last.blank?
      errors.add(:base, "Indiquez le début et la fin réels, ou laissez les deux vides.")
      return
    end

    start_minutes = clock_minutes(first)
    end_minutes = clock_minutes(last)
    unless start_minutes && end_minutes
      errors.add(:base, "Les heures réelles doivent être au format HH:MM.")
      return
    end

    if end_minutes <= start_minutes
      errors.add(:base, "La fin réelle doit être après le début réel, le même jour.")
    end
  end
end
