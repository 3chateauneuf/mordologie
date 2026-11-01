class PreservePlanningTaskBlockDetails < ActiveRecord::Migration[8.0]
  def change
    # Moving a scheduled block back into the inbox must not erase metadata.
    add_column :planning_tasks, :tags, :text, array: true, null: false, default: []
    add_column :planning_tasks, :actual_minutes, :integer
  end
end
