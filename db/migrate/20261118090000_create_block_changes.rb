class CreateBlockChanges < ActiveRecord::Migration[8.0]
  # Undo / redo history for calendar actions (Ctrl+Z, Ctrl+Shift+Z).
  def change
    create_table :block_changes do |t|
      t.references :user, null: false, foreign_key: true
      # No foreign key: undoing a creation removes the block, and redoing it
      # brings it back with the same id.
      t.bigint :time_block_id, null: false
      t.string :action, null: false, limit: 20
      t.jsonb :state_before # nil when the action created the block
      t.jsonb :state_after, null: false
      t.datetime :undone_at
      t.timestamps
    end

    add_index :block_changes, [:user_id, :id]
    add_index :block_changes, :time_block_id
  end
end
