require "application_system_test_case"

class PlannerDeleteActionTest < ApplicationSystemTestCase
  setup do
    @user = User.create!(
      email: "browser-delete@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    @task = @user.planning_tasks.create!(
      title: "À supprimer", category: "travail", estimated_minutes: 45
    )
    @block = @user.time_blocks.create!(
      title: @task.title, category: @task.category,
      start_at: Time.zone.local(2026, 11, 2, 10, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 45)
    )
    @task.update!(scheduled_block: @block)
    login
  end

  test "cancelling permanent deletion retains linked task and calendar block" do
    visit edit_time_block_path(@block)
    assert_selector ".editor-standby-button", text: "Remettre en attente"
    assert_selector ".editor-delete-button", text: "Supprimer définitivement"

    dismiss_confirm(/irréversible/) do
      click_button "Supprimer définitivement"
    end

    assert_current_path edit_time_block_path(@block)
    assert TimeBlock.exists?(@block.id)
    assert_equal @block.id, @task.reload.scheduled_block_id
  end

  test "confirming permanent deletion removes both linked records" do
    protection = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true

    begin
      visit edit_time_block_path(@block)
      accept_confirm(/irréversible/) do
        click_button "Supprimer définitivement"
      end

      assert_selector ".notice", text: /supprimée définitivement/
      assert_not TimeBlock.exists?(@block.id)
      assert_not PlanningTask.exists?(@task.id)
    ensure
      ActionController::Base.allow_forgery_protection = protection
    end
  end

  test "returning to standby is distinct from permanent deletion" do
    visit edit_time_block_path(@block)
    click_button "Remettre en attente"

    assert_selector ".pending-task", text: "À supprimer"
    assert_not TimeBlock.exists?(@block.id)
    assert_nil @task.reload.scheduled_block_id
    assert PlanningTask.exists?(@task.id)
  end
end
