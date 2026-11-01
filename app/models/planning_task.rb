# A task exists independently from its calendar reservation.
# scheduled_block_id is optional: nil means it belongs to the pending inbox.
# A unique database index prevents scheduling the same task twice.
class PlanningTask < ApplicationRecord
  belongs_to :user
  belongs_to :scheduled_block, class_name: "TimeBlock", optional: true

  scope :pending, -> { where(scheduled_block_id: nil) }

  validates :title, presence: true, length: { maximum: 120 }
  validates :category, inclusion: { in: TimeBlock::CATEGORIES.keys }
  validates :estimated_minutes, numericality: {
    only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 960
  }
  validate :scheduled_block_belongs_to_user

  def scheduled?
    scheduled_block_id.present?
  end

  # Retain the edited name, category and duration when a block is taken
  # out of the calendar; the task remains available for future planning.
  def update_from_block!(block)
    update!(
      title: block.title,
      category: block.category,
      estimated_minutes: block.duration_minutes,
      notes: block.notes
    )
  end

  private

  def scheduled_block_belongs_to_user
    return unless scheduled_block
    return if scheduled_block.user_id == user_id

    errors.add(:scheduled_block, "doit appartenir au même compte")
  end
end
