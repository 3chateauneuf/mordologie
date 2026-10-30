class CreateUsersAndTimeBlocks < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.timestamps
    end
    add_index :users, :email, unique: true

    create_table :time_blocks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.string :category, null: false, default: "travail"
      t.datetime :start_at, null: false
      t.datetime :end_at, null: false
      t.integer :actual_minutes
      t.text :notes
      t.timestamps
    end
    add_index :time_blocks, [:user_id, :start_at]
  end
end
