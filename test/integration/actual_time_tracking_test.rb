require "test_helper"

class ActualTimeTrackingTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "actual-time-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    post session_path, params: {
      email: @user.email, password: "test-password-1234"
    }
    assert_redirected_to root_path

    @block = @user.time_blocks.create!(
      title: "Montage", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 11, 45)
    )
  end

  test "14:11 to 17:38 calculates 207 actual minutes, without changing planned time" do
    patch time_block_path(@block), params: block_params(
      actual_start_clock: "14:11", actual_end_clock: "17:38"
    )
    assert_response :redirect

    @block.reload
    assert_equal "14:11", @block.actual_start_clock
    assert_equal "17:38", @block.actual_end_clock
    assert_equal 207, @block.actual_minutes
    assert_equal 165, @block.duration_minutes
    assert_equal "09:00", @block.start_at.in_time_zone.strftime("%H:%M")
  end

  test "the server ignores a forged minute total and derives duration from clocks" do
    patch time_block_path(@block), params: {
      time_block: block_params[:time_block].merge(
        actual_start_clock: "14:11", actual_end_clock: "17:38",
        actual_minutes: "999"
      )
    }
    assert_response :redirect
    assert_equal 207, @block.reload.actual_minutes
  end

  test "new activity can be saved without real clock times" do
    post time_blocks_path, params: {
      time_block: {
        title: "Sans temps réel", category: "travail",
        schedule_date: "2026-11-03", start_clock: "10:00",
        duration_minutes: "30", actual_start_clock: "", actual_end_clock: ""
      }
    }
    assert_response :redirect
    block = @user.time_blocks.last
    assert_nil block.actual_minutes
    assert_nil block.actual_start_clock.presence
    assert_nil block.actual_end_clock.presence
  end

  test "one missing real clock is rejected and existing data remains intact" do
    patch time_block_path(@block), params: block_params(
      actual_start_clock: "14:11", actual_end_clock: ""
    )
    assert_response :unprocessable_entity
    assert_select ".editor-error", text: /début et la fin réels/

    @block.reload
    assert_nil @block.actual_minutes
    assert_nil @block.actual_start_clock
    assert_nil @block.actual_end_clock
  end

  test "an end before start or an invalid clock is rejected" do
    [
      { actual_start_clock: "17:38", actual_end_clock: "14:11" },
      { actual_start_clock: "14:11", actual_end_clock: "14:11" },
      { actual_start_clock: "27:00", actual_end_clock: "17:38" }
    ].each do |value|
      patch time_block_path(@block), params: block_params(value)
      assert_response :unprocessable_entity
      assert_nil @block.reload.actual_minutes
      assert_nil @block.actual_start_clock
      assert_nil @block.actual_end_clock
    end
  end

  test "clearing an existing pair clears the derived total" do
    @block.update!(actual_start_clock: "14:11", actual_end_clock: "17:38")
    assert_equal 207, @block.actual_minutes

    patch time_block_path(@block), params: block_params(
      actual_start_clock: "", actual_end_clock: ""
    )
    assert_response :redirect
    @block.reload
    assert_nil @block.actual_minutes
    assert_nil @block.actual_start_clock.presence
    assert_nil @block.actual_end_clock.presence
  end

  test "historical actual minutes without clock times are not lost" do
    @block.update!(actual_minutes: 80)
    get edit_time_block_path(@block)
    assert_response :success
    assert_select ".editor-legacy-duration", text: /1 h 20/
    assert_select "#time_block_actual_start_clock", count: 1
    assert_select "#time_block_actual_end_clock", count: 1

    patch time_block_path(@block), params: block_params(
      actual_start_clock: "", actual_end_clock: ""
    )
    assert_response :redirect
    assert_equal 80, @block.reload.actual_minutes

    patch time_block_path(@block), params: block_params(
      actual_start_clock: "14:11", actual_end_clock: "17:38"
    )
    assert_response :redirect
    assert_equal 207, @block.reload.actual_minutes
  end

  test "real start/end survive standby and reprogramming with the same linked task" do
    @block.update!(actual_start_clock: "14:11", actual_end_clock: "17:38")
    post return_to_inbox_time_block_path(@block)
    assert_response :redirect
    task = @user.planning_tasks.last
    assert_equal 207, task.actual_minutes
    assert_equal "14:11", task.actual_start_clock
    assert_equal "17:38", task.actual_end_clock

    post schedule_planning_task_path(task), params: {
      schedule_date: "2026-11-03", start_clock: "11:00"
    }
    assert_response :redirect
    block = task.reload.scheduled_block
    assert_equal 207, block.actual_minutes
    assert_equal "14:11", block.actual_start_clock
    assert_equal "17:38", block.actual_end_clock
    assert_equal 165, block.duration_minutes
  end

  test "the editor exposes two real clock fields and no manual minutes input" do
    get edit_time_block_path(@block)
    assert_response :success
    assert_select "input[type='time'][name='time_block[actual_start_clock]']", count: 1
    assert_select "input[type='time'][name='time_block[actual_end_clock]']", count: 1
    assert_select "input[name='time_block[actual_minutes]']", count: 0
    assert_select "script[src='/scripts/real-time-fields.js']", count: 1
    assert_select "link[href='/styles/real-time-fields.css']", count: 1
    assert_select "script:not([src])", count: 0
  end

  private

  def block_params(changes = {})
    {
      time_block: {
        title: @block.title,
        category: @block.category,
        schedule_date: "2026-11-02",
        start_clock: "09:00",
        duration_minutes: "165",
        tag_list: @block.tag_list
      }.merge(changes)
    }
  end
end
