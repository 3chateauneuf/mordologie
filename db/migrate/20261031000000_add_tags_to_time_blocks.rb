class AddTagsToTimeBlocks < ActiveRecord::Migration[8.0]
  def change
    add_column :time_blocks, :tags, :text, array: true, default: [], null: false
    add_index :time_blocks, :tags, using: :gin
  end
end
