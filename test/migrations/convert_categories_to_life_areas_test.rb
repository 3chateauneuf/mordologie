require "test_helper"
require Rails.root.join("db/migrate/20261119100000_convert_categories_to_life_areas")

class ConvertCategoriesToLifeAreasTest < ActiveSupport::TestCase
  setup do
    @spanish = User.create!(email: "areas-es@example.test", password: "test-password-1234",
                            password_confirmation: "test-password-1234", locale: "es")
    @french = User.create!(email: "areas-fr@example.test", password: "test-password-1234",
                           password_confirmation: "test-password-1234", locale: "fr")
  end

  test "old categories become areas and keep their meaning as a tag" do
    meeting = old_block(@spanish, "reunion")
    pause = old_block(@french, "pause", tags: ["pause"])
    personal = old_block(@spanish, "personnel")
    work = old_block(@french, "travail")
    task = @spanish.planning_tasks.create!(title: "Llamada", category: "travail", estimated_minutes: 30)
    task.update_columns(category: "reunion")

    migrate

    assert_equal ["travail", ["reunión"]], [meeting.reload.category, meeting.tags]
    assert_equal ["vie", ["pause"]], [pause.reload.category, pause.tags], "no duplicate tag"
    assert_equal ["vie", []], [personal.reload.category, personal.tags]
    assert_equal ["travail", []], [work.reload.category, work.tags]
    assert_equal ["travail", ["reunión"]], [task.reload.category, task.tags]
  end

  private

  # Old categories are no longer valid, so they are written past validation.
  def old_block(user, category, tags: [])
    block = user.time_blocks.create!(
      title: "Bloc #{category}", category: "travail", tags: tags,
      start_at: Time.zone.local(2026, 11, 2, 9, 0), end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    block.update_columns(category: category)
    block
  end

  def migrate
    ActiveRecord::Migration.suppress_messages { ConvertCategoriesToLifeAreas.new.up }
  end
end
