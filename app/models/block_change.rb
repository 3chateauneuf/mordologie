# One undoable calendar action: the block as it was before and after.
# See BlockHistory for how changes are recorded, undone and redone.
class BlockChange < ApplicationRecord
  # Names are translated: block_history.actions.* in config/locales.
  ACTIONS = %w[move resize create duplicate].freeze

  belongs_to :user

  validates :action, inclusion: { in: ACTIONS }

  scope :active, -> { where(undone_at: nil) }
  scope :undone, -> { where.not(undone_at: nil) }

  def label
    title = (state_after || state_before).fetch("title")
    I18n.t("block_history.actions.#{action}", title: title)
  end

  # Creation and duplication have no "before": undoing them removes the block.
  def created_block?
    state_before.nil?
  end
end
