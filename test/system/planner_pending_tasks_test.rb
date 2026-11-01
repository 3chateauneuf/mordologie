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
    assert_field "Durée en minutes", with: "45"

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
  end
end
