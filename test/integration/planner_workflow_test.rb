require "test_helper"

class PlannerWorkflowTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "planner-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
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
    assert_select "script[src='/scripts/week-calendar.js']", count: 1
    assert_select "link[href='/styles/foundation.css']", count: 1
    assert_select "style", count: 0
    assert_select "script:not([src])", count: 0
  end

  test "create, edit and delete a time block with tags" do
    assert_difference("TimeBlock.count", 1) do
      post time_blocks_path, params: {
        time_block: {
          title: "Préparer un épisode",
          category: "travail",
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
    assert_select "script[src='/scripts/time-block-form.js']", count: 1
    assert_select "script:not([src])", count: 0

    patch time_block_path(block), params: {
      time_block: {
        title: "Monter un épisode",
        category: "travail",
        schedule_date: "2026-11-02",
        start_clock: "10:00",
        duration_minutes: "30",
        tag_list: "montage",
        notes: "Terminé",
        actual_minutes: "42"
      }
    }
    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    block.reload
    assert_equal "Monter un épisode", block.title
    assert_equal 30, block.duration_minutes
    assert_equal 42, block.actual_minutes
    assert_equal ["montage"], block.tags

    assert_difference("TimeBlock.count", -1) do
      delete time_block_path(block)
    end
  end

  test "an invalid time does not create a block" do
    assert_no_difference("TimeBlock.count") do
      post time_blocks_path, params: {
        time_block: {
          title: "Impossible",
          category: "travail",
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
