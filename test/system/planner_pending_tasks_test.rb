require "application_system_test_case"

class PlannerPendingTasksTest < ApplicationSystemTestCase
  setup do
    @user = User.create!(
      email: "browser-pending@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    login
  end

  test "create a pending task, schedule it, and return it to the inbox" do
    visit root_path(week: "2026-11-02", day: "2026-11-02")
    within ".pending-panel" do
      find("summary", text: "+ Ajouter").click
      fill_in "Activité", with: "Rédiger une proposition"
      fill_in "Durée estimée (min)", with: "45"
      click_button "Ajouter"
    end
    assert_selector ".pending-task", text: "Rédiger une proposition"

    within ".pending-task", text: "Rédiger une proposition" do
      click_link "Planifier"
    end
    assert_selector ".planner-dialog-panel", text: "Nouveau créneau"
    assert_field "Activité", with: "Rédiger une proposition"
    assert_field "time_block_duration_minutes", with: "45"

    click_button "Créer le créneau"
    assert_selector ".day-body .event", text: "Rédiger une proposition"
    assert_no_selector ".pending-task", text: "Rédiger une proposition"

    click_link "Rédiger une proposition"
    assert_selector ".planner-dialog-panel", text: "Modifier le créneau"
    accept_confirm do
      click_button "Remettre en attente"
    end
    assert_selector ".pending-task", text: "Rédiger une proposition"
    assert_no_selector ".day-body .event", text: "Rédiger une proposition"

    within ".pending-task", text: "Rédiger une proposition" do
      accept_confirm do
        find(".pending-remove").click
      end
    end
    assert_no_selector ".pending-task", text: "Rédiger une proposition"
  end
  test "desktop dragging a pending task opens its scheduling form without saving" do
    task = @user.planning_tasks.create!(
      title: "Préparer le montage",
      category: "travail",
      estimated_minutes: 30
    )

    visit root_path(week: "2026-11-02", day: "2026-11-02")
    find(".pending-task[data-pending-task-id='#{task.id}']").drag_to(
      find(".day-body.is-active-day")
    )

    assert_selector ".planner-dialog-panel", text: "Nouveau créneau"
    assert_field "Activité", with: "Préparer le montage"
    assert_field "time_block_duration_minutes", with: "30"
    assert_equal 0, @user.time_blocks.count
    assert_nil task.reload.scheduled_block_id
  end
end
