require "application_system_test_case"

class PlannerEndTimeTest < ApplicationSystemTestCase
  # Past blocks: they have started, so changes are recorded as the real end.
  setup do
    @user = User.create!(
      email: "browser-end-time@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    @block = @user.time_blocks.create!(
      title: "Montage vidéo", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    @next_block = @user.time_blocks.create!(
      title: "Appel client", category: "reunion",
      start_at: Time.zone.local(2026, 11, 2, 10, 0),
      end_at: Time.zone.local(2026, 11, 2, 11, 0)
    )
    login
  end

  test "the end time is visible and can be extended, typed or dragged" do
    visit root_path(week: "2026-11-02", day: "2026-11-02")
    event = ".event[data-calendar-block-id='#{@block.id}']"
    assert_selector "#{event} .event-end-time", text: "10:00"

    # +30 min saves straight away and the blocks now sit side by side.
    find("#{event} .event-end-time").click
    assert_selector "[data-end-time-popover]", text: "Fin réelle"
    click_button "+30 min"
    assert_selector "#{event} .event-end-time", text: "10:30"
    assert_equal "10:30", @block.reload.actual_end_clock
    assert_equal "09:00", @block.actual_start_clock

    first = position(event)
    second = position(".event[data-calendar-block-id='#{@next_block.id}']")
    assert_operator first["right"], :<=, second["left"] + 1
    assert_selector ".event-planned-ghost"
    screenshot("desktop-end-time-overlap")

    # Typing an exact time.
    find("#{event} .event-end-time").click
    # A Time value lets Capybara set the field reliably; typing over a
    # prefilled <input type="time"> depends on Chrome's segment editing.
    fill_in "Heure de fin", with: Time.zone.parse("2026-11-02 11:15")
    find("[data-end-time-input]").send_keys(:enter)
    assert_selector "#{event} .event-end-time", text: "11:15"
    assert_equal "11:15", @block.reload.actual_end_clock

    # Dragging the bottom edge, in 5-minute steps.
    handle = find("#{event} [data-end-time-resize]", visible: :all)
    page.driver.browser.action
        .move_to(handle.native).click_and_hold
        .move_by(0, 66).release.perform
    # Wait for the save itself: reading the block while the page reloads
    # can hit a detached element.
    resized = wait_for_new_end(@block, previous: "11:15")
    assert_operator resized, :>, "11:15"
    assert_equal 0, resized.split(":").last.to_i % 5
    assert_selector "#{event} .event-end-time", text: resized
  end

  test "mobile opens the end-time editor as a bottom sheet" do
    page.driver.browser.manage.window.resize_to(390, 844)
    visit root_path(week: "2026-11-02", day: "2026-11-02")

    find(".event[data-calendar-block-id='#{@block.id}'] .event-end-time").click
    assert_selector "[data-end-time-popover]", text: "Fin réelle"
    sheet = position("[data-end-time-popover]")
    viewport_height = page.evaluate_script("window.innerHeight")
    assert_in_delta viewport_height, sheet["bottom"], 2
    screenshot("mobile-end-time-sheet")

    click_button "+1 h"
    assert_selector ".event[data-calendar-block-id='#{@block.id}'] .event-end-time", text: "11:00"
  end

  private

  def wait_for_new_end(block, previous:)
    page.document.synchronize(5) do
      current = block.reload.actual_end_clock
      raise Capybara::ExpectationNotMet, "end still #{previous}" if current == previous
      current
    end
  end
end
