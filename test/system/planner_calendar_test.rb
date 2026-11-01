require "application_system_test_case"

class PlannerCalendarTest < ApplicationSystemTestCase
  setup do
    @user = User.create!(
      email: "browser-planner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )

    # This must never change the configured first visible hour.
    @block = @user.time_blocks.create!(
      title: "Activité nocturne",
      category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 1, 30),
      end_at: Time.zone.local(2026, 11, 2, 1, 45)
    )
    login
  end

  test "desktop shows 06:00 first despite an earlier block and saves a changed hour" do
    visit root_path(week: "2026-11-02", day: "2026-11-02")

    assert_selector ".time-rail .hour:first-child", text: "06:00"
    assert_selector ".calendar-earlier-bar", text: "1 créneau avant 06:00"

    # The selector and navigation must occupy the same compact header row.
    start_position = position(".calendar-start-form")
    navigation_position = position(".week-nav")
    assert_in_delta start_position["top"], navigation_position["top"], 16

    screenshot("desktop-calendar-06h")
    select "08:00", from: "calendar_start_hour"
    assert_selector ".time-rail .hour:first-child", text: "08:00"
    assert_equal 8, @user.reload.calendar_start_hour

    click_link "Afficher les heures précédentes"
    assert_selector ".time-rail .hour:first-child", text: "01:00"
    assert_link "Activité nocturne"

    click_link "Revenir à 08:00"
    assert_selector ".time-rail .hour:first-child", text: "08:00"
  end

  test "desktop dialogs close with Escape and a backdrop click" do
    visit root_path(week: "2026-11-02", day: "2026-11-02")
    click_link "+ Planifier un créneau"
    assert_selector "[data-planner-dialog-panel]", text: "Nouveau créneau"
    page.find("#time_block_title").send_keys(:escape)
    assert_current_path root_path(week: "2026-11-02", day: "2026-11-02")

    click_link "Afficher les heures précédentes"
    click_link "Activité nocturne"
    assert_selector "[data-planner-dialog-panel]", text: "Modifier le créneau"

    # Click on the backdrop itself, away from the dialog panel.
    page.evaluate_script(<<~JS)
      (() => {
        const backdrop = document.querySelector("[data-planner-dialog]");
        backdrop.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      })()
    JS
    assert_current_path root_path(week: "2026-11-02", day: "2026-11-02")
    assert_equal "Activité nocturne", @block.reload.title
  end

  test "mobile keeps the calendar in one column and the hour picker usable" do
    page.driver.browser.manage.window.resize_to(390, 844)
    visit root_path(week: "2026-11-02", day: "2026-11-02")

    assert_selector ".time-rail .hour:first-child", text: "06:00"
    assert_selector ".day-body.is-active-day", visible: true, count: 1
    assert_no_selector ".day-heading", visible: true
    assert_equal "visible", page.evaluate_script(
      "getComputedStyle(document.querySelector('.calendar-scroll')).overflowY"
    )
    assert_selector ".calendar-start-form select", visible: true, count: 1

    page_width = page.evaluate_script("document.documentElement.scrollWidth")
    viewport_width = page.evaluate_script("window.innerWidth")
    assert_operator page_width, :<=, viewport_width + 1

    header = position(".calendar-header")
    assert_operator header["bottom"] - header["top"], :<=, 115

    screenshot("mobile-calendar-06h")
    select "07:00", from: "calendar_start_hour"
    assert_selector ".time-rail .hour:first-child", text: "07:00"
    assert_equal 7, @user.reload.calendar_start_hour

    click_link "+ Planifier un créneau"
    assert_selector ".planner-dialog-panel", text: "Nouveau créneau"
    assert_selector ".planner-dialog-mobile-back", visible: true
    screenshot("mobile-new-block")
  end
end
