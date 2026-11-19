class TimeBlock < ApplicationRecord
  include ActualTimeTracking
  # The three areas of life every block belongs to (work, life, learning),
  # each with its own colour so the week's balance shows at a glance.
  # Finer distinctions (#reunión, #pausa…) are tags. Names are translated
  # (categories.* in config/locales); use TimeBlock.category_label(key).
  CATEGORIES = {
    "work" => { color: "#5268ca" },     # blue
    "life" => { color: "#348e80" },     # green
    "learning" => { color: "#b5740e" }  # amber
  }.freeze
  DEFAULT_CATEGORY = "work"

  def self.category_label(key)
    I18n.t("categories.#{key}")
  end

  # [[label, key], ...] for select menus, in the current language.
  def self.category_options
    CATEGORIES.keys.map { |key| [category_label(key), key] }
  end

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
  validate :valid_interval
  validate :valid_tags

  def duration_minutes
    return 0 unless start_at && end_at
    ((end_at - start_at) / 60).round
  end

  def color
    CATEGORIES.fetch(category, CATEGORIES.fetch(DEFAULT_CATEGORY))[:color]
  end

  # The calendar draws what really happened when it is known,
  # and falls back to the planned slot otherwise.
  def displayed_start_at
    actual_clock_time(actual_start_clock) || start_at
  end

  def displayed_end_at
    finish = actual_clock_time(actual_end_clock)
    return finish if finish && finish > displayed_start_at

    # Real start without a real end yet: keep the planned length,
    # without crossing midnight.
    [displayed_start_at + duration_minutes.minutes,
     start_at.in_time_zone.end_of_day].min
  end

  def displayed_duration_minutes
    ((displayed_end_at - displayed_start_at) / 60).round
  end

  def shows_actual_time?
    displayed_start_at != start_at || displayed_end_at != end_at
  end

  # Once a block has begun, its end time describes what really happened.
  # Before that, it is still a plan.
  def started?(now = Time.current)
    displayed_start_at <= now
  end

  private

  # Real clocks are stored as "HH:MM" on the block's own day.
  def actual_clock_time(clock)
    minutes = WallClock.minutes(clock)
    return nil unless minutes && start_at

    WallClock.at(start_at.in_time_zone.to_date, minutes)
  end

  def valid_tags
    if tags.length > 12
      errors.add(:tags, :too_many_tags)
    end
    if tags.any? { |tag| tag.length > 40 }
      errors.add(:tags, :tag_too_long)
    end
  end

  def valid_interval
    return unless start_at && end_at
    errors.add(:end_at, :after_start) unless end_at > start_at
    errors.add(:end_at, :same_day) unless start_at.in_time_zone.to_date == end_at.in_time_zone.to_date
    errors.add(:end_at, :too_long_block) if end_at - start_at > 16.hours
  end
end
