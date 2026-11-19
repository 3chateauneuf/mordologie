require "test_helper"
require Rails.root.join("db/migrate/20261119140000_rename_life_areas_to_english")

class RenameLifeAreasToEnglishTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(email: "areas-en@example.test", password: "test-password-1234",
                         password_confirmation: "test-password-1234")
  end

  test "French area keys become English and the undo history is emptied" do
    block = @user.time_blocks.create!(
      title: "Cours", category: "work",
      start_at: Time.zone.local(2026, 11, 2, 9, 0), end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    block.update_columns(category: "apprentissage")
    task = @user.planning_tasks.create!(title: "Courses", category: "work", estimated_minutes: 30)
    task.update_columns(category: "vie")
    BlockHistory.new(@user).record("move", block, before: BlockHistory.snapshot(block).merge("title" => "Old"))

    ActiveRecord::Migration.suppress_messages { RenameLifeAreasToEnglish.new.up }

    assert_equal "learning", block.reload.category
    assert_equal "life", task.reload.category
    assert_equal 0, @user.block_changes.count
  end
end
