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
    elsif attribute_in_database("actual_start_clock").present? ||
          attribute_in_database("actual_end_clock").present?
      # An existing computed duration is no longer reliable when its pair
      # becomes incomplete or is cleared. An untouched legacy total,
      # recorded without clocks, remains intact.
      self.actual_minutes = nil
    end
  end

  def valid_actual_clock_pair
    first = actual_start_clock
    last = actual_end_clock
    return if first.blank? && last.blank?

    # A partial entry can be saved now and completed later.
    # It has no calculable duration until both clocks are present.
    if first.present? && clock_minutes(first).nil?
      errors.add(:actual_start_clock, "doit être au format HH:MM")
    end
    if last.present? && clock_minutes(last).nil?
      errors.add(:actual_end_clock, "doit être au format HH:MM")
    end
    return if errors.any? || first.blank? || last.blank?

    if clock_minutes(last) <= clock_minutes(first)
      errors.add(:base, "La fin réelle doit être après le début réel, le même jour.")
    end
  end
end
