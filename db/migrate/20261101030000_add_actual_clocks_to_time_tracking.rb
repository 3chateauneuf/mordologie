class AddActualClocksToTimeTracking < ActiveRecord::Migration[8.0]
  def change
    # Existing actual_minutes are preserved even when no clock pair exists.
    [:time_blocks, :planning_tasks].each do |table|
      add_column table, :actual_start_clock, :string, limit: 5
      add_column table, :actual_end_clock, :string, limit: 5
    end
  end
end
