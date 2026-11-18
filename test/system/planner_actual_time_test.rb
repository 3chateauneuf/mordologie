require "application_system_test_case"

class PlannerActualTimeTest < ApplicationSystemTestCase
  setup do
    @user = User.create!(
      email: "browser-actual-time@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    @block = @user.time_blocks.create!(
      title: "Montage réel", category: "travail",
      notes: "Version courte\npour Instagram", tags: ["video"],
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 11, 45)
    )
    login
  end

  test "typing the end in the dialog updates the duration and saves the real end" do
    visit edit_time_block_path(@block)
    assert_selector ".editor-actual-note", text: "09:00 – 11:45"

    fill_in "Fin", with: Time.zone.parse("2026-11-02 12:30")
    assert_field "time_block_duration_minutes", with: "210"

    click_button "Enregistrer"
    assert_selector ".day-body .event", text: "Montage réel"
    assert_equal "09:00", @block.reload.actual_start_clock
    assert_equal "12:30", @block.actual_end_clock
    assert_equal 165, @block.duration_minutes
  end

  test "an end before the start is flagged and cannot be saved" do
    visit edit_time_block_path(@block)
    fill_in "Fin", with: Time.zone.parse("2026-11-02 08:30")

    assert_selector "[data-end-message]", text: "La fin doit être après le début."
    assert_selector "#planner-time-block-submit[disabled]"
  end

  test "a cleared end cannot be saved" do
    visit edit_time_block_path(@block)
    assert_no_selector "#planner-time-block-submit[disabled]"
    # Clearing a time field by keyboard depends on Chrome's segment editing,
    # so the field is emptied the way the browser reports it.
    page.execute_script(<<~JS)
      const end = document.querySelector("[data-end-input]");
      end.value = "";
      end.dispatchEvent(new Event("input", { bubbles: true }));
    JS

    assert_selector "#planner-time-block-submit[disabled]"
  end

  test "hovering a block with a note and tags shows them without opening it" do
    visit root_path(week: "2026-11-02", day: "2026-11-02")
    event = find(".event[data-calendar-block-id='#{@block.id}']")
    assert_selector ".event[data-calendar-block-id='#{@block.id}'] .event-badges svg", count: 2

    event.hover
    assert_selector "[data-event-hovercard]", visible: true, text: "#video"
    assert_selector "[data-event-hovercard]", text: "Version courte"
    screenshot("desktop-hovercard")
  end
end
