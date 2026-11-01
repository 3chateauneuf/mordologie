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
  test "dragging an independent block to standby creates a pending task" do
    block = @user.time_blocks.create!(
      title: "Réviser la semaine", category: "travail",
      notes: "Penser au client", tags: ["projet"],
      start_at: Time.zone.local(2026, 11, 2, 10, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 45)
    )

    visit root_path(week: "2026-11-02", day: "2026-11-02")
    find(".event[data-calendar-block-id='#{block.id}']").drag_to(
      find(".pending-panel")
    )

    assert_no_selector ".planner-dialog-panel"
    assert_no_selector ".event", text: "Réviser la semaine"
    assert_selector ".pending-task", text: "Réviser la semaine"
    task = @user.planning_tasks.last
    assert_equal 45, task.estimated_minutes
    assert_equal ["projet"], task.tags
    assert_nil task.scheduled_block_id
    assert_not TimeBlock.exists?(block.id)

    find(".pending-task[data-pending-task-id='#{task.id}']").drag_to(
      find(".day-body.is-active-day")
    )
    assert_selector ".event", text: "Réviser la semaine"
    assert_no_selector ".pending-task", text: "Réviser la semaine"
    assert_equal task.id, @user.planning_tasks.last.id
    assert_equal ["projet"], task.reload.scheduled_block.tags
  end

  test "dragging a linked reservation to standby never duplicates its task" do
    task = @user.planning_tasks.create!(
      title: "Montage", category: "travail", estimated_minutes: 60
    )
    visit root_path(week: "2026-11-02", day: "2026-11-02")

    find(".pending-task[data-pending-task-id='#{task.id}']").drag_to(
      find(".day-body.is-active-day")
    )
    assert_selector ".event", text: "Montage"
    block = task.reload.scheduled_block

    find(".event[data-calendar-block-id='#{block.id}']").drag_to(
      find(".pending-panel")
    )
    assert_no_selector ".event", text: "Montage"
    assert_selector ".pending-task[data-pending-task-id='#{task.id}']"
    assert_equal 1, @user.planning_tasks.where(id: task.id).count
    assert_nil task.reload.scheduled_block_id
  end

  test "desktop dragging places a pending task immediately at its dropped time" do
    task = @user.planning_tasks.create!(
      title: "Préparer le montage",
      category: "travail",
      estimated_minutes: 30
    )

    visit root_path(week: "2026-11-02", day: "2026-11-02")
    find(".pending-task[data-pending-task-id='#{task.id}']").drag_to(
      find(".day-body.is-active-day")
    )

    assert_no_selector ".planner-dialog-panel"
    assert_selector ".day-body .event", text: "Préparer le montage"
    assert_no_selector ".pending-task", text: "Préparer le montage"

    block = task.reload.scheduled_block
    assert_not_nil block
    assert_equal 30, block.duration_minutes
    assert_equal Date.iso8601("2026-11-02"), block.start_at.in_time_zone.to_date
  end
end
