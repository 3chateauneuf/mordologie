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

  test "a long title gets two lines and the icons sit on the time line" do
    @block.update!(title: "Préparer les scripts Instagram de la semaine prochaine")
    visit root_path(week: "2026-11-02", day: "2026-11-02")
    selector = ".event[data-calendar-block-id='#{@block.id}']"
    assert_selector "#{selector} .event-badges svg", count: 2

    sides = page.evaluate_script(<<~JS)
      (() => {
        const event = document.querySelector("#{selector}").getBoundingClientRect();
        const badges = document.querySelector("#{selector} .event-badges").getBoundingClientRect();
        const title = document.querySelector("#{selector} strong").getBoundingClientRect();
        const inTimes = !!document.querySelector("#{selector} .event-times .event-badges");
        return { eventRight: event.right, badgesRight: badges.right, badgesWidth: badges.width,
                 titleHeight: title.height, inTimes: inTimes };
      })()
    JS
    assert sides["inTimes"], "icons should be on the time line"
    assert_operator sides["badgesWidth"], :>, 0
    assert_operator sides["badgesRight"], :<=, sides["eventRight"]
    assert_operator sides["titleHeight"], :>, 20, "a long title should use two lines"
  end

  test "the icons stay inside a narrow block when blocks overlap" do
    @user.time_blocks.create!(
      title: "Appel client", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 30),
      end_at: Time.zone.local(2026, 11, 2, 11, 0)
    )
    visit root_path(week: "2026-11-02", day: "2026-11-02")
    selector = ".event[data-calendar-block-id='#{@block.id}']"
    assert_selector "#{selector} .event-badges svg", count: 2

    sides = page.evaluate_script(<<~JS)
      (() => {
        const event = document.querySelector("#{selector}").getBoundingClientRect();
        const badges = document.querySelector("#{selector} .event-badges").getBoundingClientRect();
        return { eventRight: event.right, eventBottom: event.bottom,
                 badgesRight: badges.right, badgesBottom: badges.bottom, badgesWidth: badges.width };
      })()
    JS
    assert_operator sides["badgesWidth"], :>, 0
    assert_operator sides["badgesRight"], :<=, sides["eventRight"]
    assert_operator sides["badgesBottom"], :<=, sides["eventBottom"]
  end
end
