require "application_system_test_case"

class PlannerCalendarSpecificSlotTest < ApplicationSystemTestCase
  setup do
    @user = User.create!(
      email: "browser-slot@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    @block = @user.time_blocks.create!(
      title: "Déplacer le bloc", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    login
  end

  test "dropping on a visible quarter-hour slot reschedules the block" do
    visit root_path(week: "2026-11-02", day: "2026-11-02")
    page.execute_script(<<~JS)
      const day = document.querySelector(".day-body[data-day='2026-11-03']");
      const marker = document.createElement("div");
      marker.className = "test-calendar-drop-slot";
      marker.style.cssText =
        "position:absolute;top:396px;height:12px;left:5px;right:5px;z-index:30";
      day.appendChild(marker);
    JS

    find(".event[data-calendar-block-id='#{@block.id}']").drag_to(
      find(".test-calendar-drop-slot")
    )

    assert_selector ".day-body[data-day='2026-11-03'] .event",
                    text: "Déplacer le bloc"
    assert_equal "2026-11-03 12:00",
      @block.reload.start_at.in_time_zone.strftime("%F %H:%M")
    assert_equal 60, @block.duration_minutes
  end
end
