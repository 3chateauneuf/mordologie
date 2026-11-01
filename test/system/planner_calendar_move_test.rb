require "application_system_test_case"

class PlannerCalendarMoveTest < ApplicationSystemTestCase
  setup do
    @user = User.create!(
      email: "browser-move@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    @block = @user.time_blocks.create!(
      title: "Préparer un dossier", category: "travail",
      notes: "À conserver", tags: ["important"],
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    login
  end

  test "dragging within and between calendar days moves the same saved block" do
    prior_protection = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true

    begin
      visit root_path(week: "2026-11-02", day: "2026-11-02")
      form = find(".calendar-reschedule-form[data-reschedule-block-id='#{@block.id}']",
                  visible: :all)
      assert_equal reschedule_time_block_path(@block), URI(form[:action]).path
      assert_predicate form.find("input[name='authenticity_token']",
                                  visible: :all)[:value], :present?

      original = @block.start_at
      find(".event[data-calendar-block-id='#{@block.id}']").drag_to(
        find(".day-body[data-day='2026-11-02']")
      )
      assert_no_selector ".planner-dialog-panel"
      assert_equal @block.id, @block.reload.id
      assert_not_equal original, @block.start_at
      assert_equal Date.iso8601("2026-11-02"), @block.start_at.in_time_zone.to_date
      assert_equal 0, @block.start_at.in_time_zone.min % 15

      find(".event[data-calendar-block-id='#{@block.id}']").drag_to(
        find(".day-body[data-day='2026-11-03']")
      )
      assert_no_selector ".planner-dialog-panel"
      assert_selector ".day-body[data-day='2026-11-03'] .event",
                      text: "Préparer un dossier"
      assert_equal Date.iso8601("2026-11-03"), @block.reload.start_at.in_time_zone.to_date
      assert_equal 60, @block.duration_minutes
      assert_equal "À conserver", @block.notes
      assert_equal ["important"], @block.tags
      assert_equal 1, @user.time_blocks.count
    ensure
      ActionController::Base.allow_forgery_protection = prior_protection
    end
  end
end
