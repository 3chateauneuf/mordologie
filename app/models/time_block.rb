class TimeBlock < ApplicationRecord
  CATEGORIES = {
    "travail" => { label: "Travail", color: "#5268ca" },
    "reunion" => { label: "Réunion", color: "#a47b38" },
    "personnel" => { label: "Personnel", color: "#348e80" },
    "pause" => { label: "Pause", color: "#956c97" }
  }.freeze

  # A block can have multiple independent, searchable tags.
  # Categories remain separate: they define the calendar's colour.
  def tag_list
    @tag_list.nil? ? tags.join(", ") : @tag_list
  end

  def tag_list=(value)
    @tag_list = value.to_s
    self.tags = @tag_list.split(",").map do |part|
      part.strip.delete_prefix("#").strip.downcase
    end.reject(&:blank?).uniq
  end

  belongs_to :user
  has_one :planning_task, foreign_key: :scheduled_block_id, dependent: :nullify
  validates :title, presence: true, length: { maximum: 120 }
  validates :category, inclusion: { in: CATEGORIES.keys }
  validates :start_at, :end_at, presence: true
  validates :actual_minutes, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validate :valid_interval
  validate :valid_tags

  def duration_minutes
    return 0 unless start_at && end_at
    ((end_at - start_at) / 60).round
  end

  def color
    CATEGORIES.fetch(category, CATEGORIES.fetch("travail"))[:color]
  end

  private

  def valid_tags
    if tags.length > 12
      errors.add(:tags, "ne peuvent pas dépasser 12 étiquettes")
    end
    if tags.any? { |tag| tag.length > 40 }
      errors.add(:tags, "doivent contenir 40 caractères maximum chacune")
    end
  end

  def valid_interval
    return unless start_at && end_at
    errors.add(:end_at, "doit être après le début") unless end_at > start_at
    errors.add(:end_at, "doit être le même jour") unless start_at.in_time_zone.to_date == end_at.in_time_zone.to_date
    errors.add(:end_at, "ne peut dépasser 16 heures") if end_at - start_at > 16.hours
  end
end
