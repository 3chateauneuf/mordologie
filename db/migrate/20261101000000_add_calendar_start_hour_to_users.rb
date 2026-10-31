class AddCalendarStartHourToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :calendar_start_hour, :integer, default: 6, null: false
  end
end
