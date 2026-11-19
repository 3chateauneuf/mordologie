# Area keys in English, like every other name in the code:
#   travail -> work, vie -> life, apprentissage -> learning
#
# The undo/redo history is emptied: its saved copies of blocks still carry
# the old keys (and the categories from before the areas), and redoing one
# would fail. Only the ability to undo changes made before this release is
# lost.
class RenameLifeAreasToEnglish < ActiveRecord::Migration[8.0]
  RENAMES = { "travail" => "work", "vie" => "life", "apprentissage" => "learning" }.freeze

  def up
    %w[time_blocks planning_tasks].each do |table|
      RENAMES.each do |old_key, new_key|
        execute "UPDATE #{table} SET category = '#{new_key}' WHERE category = '#{old_key}'"
      end
    end
    change_column_default :time_blocks, :category, from: "travail", to: "work"
    change_column_default :planning_tasks, :category, from: "travail", to: "work"
    execute "DELETE FROM block_changes"
  end

  def down
    change_column_default :time_blocks, :category, from: "work", to: "travail"
    change_column_default :planning_tasks, :category, from: "work", to: "travail"
    %w[time_blocks planning_tasks].each do |table|
      RENAMES.each do |old_key, new_key|
        execute "UPDATE #{table} SET category = '#{old_key}' WHERE category = '#{new_key}'"
      end
    end
  end
end
