class CreatePlanningTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :planning_tasks do |t|
      t.references :user, null: false, foreign_key: true
      t.references :scheduled_block, foreign_key: { to_table: :time_blocks, on_delete: :nullify },
                  index: { unique: true }
      t.string :title, null: false, limit: 120
      t.string :category, null: false, default: "travail"
      t.integer :estimated_minutes, null: false, default: 60
      t.text :notes
      t.timestamps
    end

    add_index :planning_tasks, [:user_id, :created_at]
  end
end
