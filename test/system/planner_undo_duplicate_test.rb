require "application_system_test_case"

class PlannerUndoDuplicateTest < ApplicationSystemTestCase
  setup do
    @user = User.create!(
      email: "browser-undo@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    @block = @user.time_blocks.create!(
      title: "Préparer un dossier", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    login
  end

  test "Ctrl+Z puts a moved block back and Ctrl+Shift+Z moves it again" do
    visit root_path(week: "2026-11-02", day: "2026-11-02")
    event = ".event[data-calendar-block-id='#{@block.id}']"

    find(event).drag_to(find(".day-body[data-day='2026-11-03']"))
    assert_selector ".day-body[data-day='2026-11-03'] #{event}"
    moved_to = @block.reload.start_at

    find("body").send_keys([:control, "z"])
    assert_selector ".flash", text: "Annulé : déplacement de « Préparer un dossier »"
    assert_selector ".day-body[data-day='2026-11-02'] #{event}"
    assert_equal Time.zone.local(2026, 11, 2, 9, 0), @block.reload.start_at

    find("body").send_keys([:control, :shift, "z"])
    assert_selector ".flash", text: "Rétabli"
    assert_equal moved_to, @block.reload.start_at
  end

  test "dragging with Shift makes a copy that Ctrl+Z removes" do
    visit root_path(week: "2026-11-02", day: "2026-11-02")

    find(".event[data-calendar-block-id='#{@block.id}']").drag_to(
      find(".day-body[data-day='2026-11-04']"), drop_modifiers: [:shift]
    )
    assert_selector ".flash", text: "Créneau dupliqué."
    assert_selector ".day-body[data-day='2026-11-04'] .event", text: "Préparer un dossier"
    assert_equal 2, @user.time_blocks.count
    assert_equal Time.zone.local(2026, 11, 2, 9, 0), @block.reload.start_at

    find("body").send_keys([:control, "z"])
    assert_selector ".flash", text: "Annulé : duplication"
    assert_equal 1, @user.time_blocks.count
  end
end
