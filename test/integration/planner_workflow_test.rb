require "test_helper"

class PlannerWorkflowTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "planner-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    post session_path, params: {
      email: @user.email,
      password: "test-password-1234"
    }
    assert_redirected_to root_path
  end

  test "agenda renders without inline scripts or inline stylesheets" do
    get root_path(week: "2026-11-02", day: "2026-11-03")

    assert_response :success
    assert_select "[data-calendar]", count: 1
    assert_select "script[src^='/scripts/week-calendar.js?v=']", count: 1
    assert_select "link[href^='/styles/foundation.css?v=']", count: 1
    assert_select "style", count: 0
    assert_select "script:not([src])", count: 0
  end

  test "create, edit and delete a time block with tags" do
    assert_difference("TimeBlock.count", 1) do
      post time_blocks_path, params: {
        time_block: {
          title: "Préparer un épisode",
          category: "work",
          schedule_date: "2026-11-02",
          start_clock: "09:30",
          duration_minutes: "45",
          tag_list: "Youtube, script",
          notes: "Première version"
        }
      }
    end

    block = @user.time_blocks.order(:id).last
    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    assert_equal ["youtube", "script"], block.tags
    assert_equal 45, block.duration_minutes
    assert_equal "09:30", block.start_at.in_time_zone.strftime("%H:%M")

    get edit_time_block_path(block)
    assert_response :success
    assert_select "[data-planner-dialog]", count: 1
    assert_select ".editor-delete-button", count: 1
    assert_select "form[data-confirm-destroy]", count: 1
    assert_select "button[form='planner-time-block-form']", count: 1
    assert_select "script[src^='/scripts/time-block-form.js?v=']", count: 1
    assert_select "script:not([src])", count: 0

    patch time_block_path(block), params: {
      time_block: {
        title: "Monter un épisode",
        category: "work",
        schedule_date: "2026-11-02",
        start_clock: "10:00",
        duration_minutes: "30",
        tag_list: "montage",
        notes: "Terminé"
      }
    }
    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    block.reload
    assert_equal "Monter un épisode", block.title
    # The block is in the past: changed times are what really happened,
    # and the plan stays as it was created.
    assert_equal "10:00", block.actual_start_clock
    assert_equal "10:30", block.actual_end_clock
    assert_equal 30, block.actual_minutes
    assert_equal "09:30", block.start_at.in_time_zone.strftime("%H:%M")
    assert_equal 45, block.duration_minutes
    assert_equal ["montage"], block.tags

    assert_difference("TimeBlock.count", -1) do
      delete time_block_path(block)
    end
  end

  test "calendar begins at 06:00 by default and exposes an adjustment" do
    assert_equal 6, @user.calendar_start_hour

    get root_path(week: "2026-11-02")
    assert_response :success
    assert_select ".settings-form select option[selected][value='6']", count: 1
    assert_select "script[src^='/scripts/calendar-preferences.js?v=']", count: 1
    assert_select "link[href^='/styles/planner-toolbar.css?v=']", count: 1
    # The whole day is drawn; the page opens at the start hour.
    assert_select ".time-rail .hour", count: 24
    assert_select ".time-rail .hour:first-child", text: "00:00"
    assert_select ".calendar-scroll[data-scroll-hour='6']", count: 1
    assert_select "script[src^='/scripts/calendar-scroll-anchor.js?v=']", count: 1
    assert_select "form[action='#{calendar_preferences_path}']", count: 1
  end

  test "calendar start hour is saved for the authenticated user and can be changed" do
    patch calendar_preferences_path, params: {
      calendar_start_hour: "5", week: "2026-11-02", day: "2026-11-03"
    }
    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-03")
    assert_equal 5, @user.reload.calendar_start_hour

    get root_path(week: "2026-11-02", day: "2026-11-03")
    assert_response :success
    assert_select ".settings-form select option[selected][value='5']", count: 1
    assert_select ".calendar-scroll[data-scroll-hour='5']", count: 1
    assert_select ".mobile-day.is-selected strong", text: "3"
  end

  test "invalid calendar start is rejected without overwriting preferences" do
    ["-1", "24", "n'importe quoi", "6:30"].each do |value|
      patch calendar_preferences_path, params: { calendar_start_hour: value }
      assert_redirected_to root_path
      assert_equal 6, @user.reload.calendar_start_hour
    end
  end

  test "an early block is in the grid and the page still opens at the start hour" do
    @user.time_blocks.create!(
      title: "Livraison tôt",
      category: "work",
      start_at: Time.zone.local(2026, 11, 2, 1, 30),
      end_at: Time.zone.local(2026, 11, 2, 1, 45)
    )

    get root_path(week: "2026-11-02")
    assert_response :success
    assert_select ".time-rail .hour:first-child", text: "00:00"
    assert_select ".day-body .event", text: /Livraison tôt/
    assert_select ".calendar-scroll[data-scroll-hour='6']", count: 1
  end

  test "the current week opens one hour before the current time" do
    travel_to Time.zone.local(2026, 11, 4, 23, 10) do
      get root_path(week: "2026-11-02")
      assert_select ".calendar-scroll[data-scroll-hour='22']", count: 1
    end
    travel_to Time.zone.local(2026, 11, 4, 0, 20) do
      get root_path(week: "2026-11-02")
      assert_select ".calendar-scroll[data-scroll-hour='0']", count: 1
    end
  end

  test "late calendar start still shows a valid day and is private" do
    @user.update!(calendar_start_hour: 23)
    get root_path(week: "2026-11-02")
    assert_response :success
    assert_select ".day-body[data-start-hour='0'][data-end-hour='24']", count: 7
    assert_select ".calendar-scroll[data-scroll-hour='23']", count: 1

    other_user = User.create!(
      email: "another-user@example.test",
      password: "another-test-password",
      password_confirmation: "another-test-password",
      locale: "fr"
    )
    assert_equal 6, other_user.calendar_start_hour
  end

  test "an invalid time does not create a block" do
    assert_no_difference("TimeBlock.count") do
      post time_blocks_path, params: {
        time_block: {
          title: "Impossible",
          category: "work",
          schedule_date: "2026-11-02",
          start_clock: "23:45",
          duration_minutes: "60",
          tag_list: ""
        }
      }
    end
    assert_response :unprocessable_entity
  end
end
