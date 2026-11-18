require "test_helper"

# The block dialog has a single start / duration / end. Once a block has
# started, they are what really happened and the plan stays as created.
class ActualTimeTrackingTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "actual-time-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    post session_path, params: {
      email: @user.email, password: "test-password-1234"
    }
    assert_redirected_to root_path

    # In the past: it has started.
    @block = @user.time_blocks.create!(
      title: "Montage", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 11, 45)
    )
  end

  test "changing the times of a started block records the real times" do
    patch time_block_path(@block), params: block_params(start_clock: "14:11", duration_minutes: "207")
    assert_response :redirect

    @block.reload
    assert_equal "14:11", @block.actual_start_clock
    assert_equal "17:38", @block.actual_end_clock
    assert_equal 207, @block.actual_minutes
    assert_equal 165, @block.duration_minutes
    assert_equal "09:00", @block.start_at.in_time_zone.strftime("%H:%M")
  end

  test "editing only the title never invents real times" do
    patch time_block_path(@block), params: block_params(title: "Montage final")
    assert_response :redirect

    @block.reload
    assert_equal "Montage final", @block.title
    assert_nil @block.actual_start_clock
    assert_nil @block.actual_end_clock
    assert_nil @block.actual_minutes
  end

  test "a future block's times are still the plan" do
    future = @user.time_blocks.create!(
      title: "Plus tard", category: "travail",
      start_at: Time.zone.local(2030, 1, 7, 9, 0),
      end_at: Time.zone.local(2030, 1, 7, 10, 0)
    )
    patch time_block_path(future), params: {
      time_block: { title: "Plus tard", category: "travail", schedule_date: "2030-01-07",
                    start_clock: "10:00", duration_minutes: "90" }
    }

    future.reload
    assert_equal "10:00", future.start_at.in_time_zone.strftime("%H:%M")
    assert_equal 90, future.duration_minutes
    assert_nil future.actual_start_clock
  end

  test "on a daylight-saving day the planned end entered is the end saved" do
    post time_blocks_path, params: {
      time_block: { title: "Nuit courte", category: "travail", schedule_date: "2030-03-31",
                    start_clock: "01:00", duration_minutes: "180" }
    }

    block = @user.time_blocks.find_by!(title: "Nuit courte")
    assert_equal "04:00", block.end_at.in_time_zone.strftime("%H:%M")

    get edit_time_block_path(block)
    assert_select "input[name='time_block[duration_minutes]'][value='180']"
  end

  test "the dialog shows the real times, the plan as a note and an editable end" do
    @block.update!(actual_start_clock: "09:10", actual_end_clock: "12:00")

    get edit_time_block_path(@block)
    assert_response :success
    assert_select "#time_block_start_clock[value='09:10']"
    assert_select "#time_block_duration_minutes[value='170']"
    assert_select "input[type='time'][data-end-input]", count: 1
    assert_select ".editor-actual-note", text: /09:00 – 11:45/
    assert_select "textarea[name='time_block[notes]']", count: 1
    # The separate real-time section is gone.
    assert_select "[name='time_block[actual_start_clock]'], [name='time_block[actual_end_clock]']", count: 0
    assert_select ".editor-details", count: 0
  end

  test "a new block's dialog has no real-time note" do
    get new_time_block_path(day: "2030-01-07")
    assert_select ".editor-actual-note", count: 0
  end

  test "real-time fields sent by hand are ignored" do
    patch time_block_path(@block), params: block_params(
      actual_start_clock: "14:11", actual_end_clock: "17:38", actual_minutes: "999"
    )

    @block.reload
    assert_nil @block.actual_start_clock
    assert_nil @block.actual_minutes
  end

  test "moving a started block to another day moves the plan and keeps real clocks" do
    @block.update!(actual_start_clock: "09:10", actual_end_clock: "12:00")
    patch time_block_path(@block), params: block_params(
      schedule_date: "2026-11-04", start_clock: "09:10", duration_minutes: "170"
    )

    @block.reload
    assert_equal "2026-11-04 09:00", @block.start_at.in_time_zone.strftime("%F %H:%M")
    assert_equal "09:10", @block.actual_start_clock
    assert_equal "12:00", @block.actual_end_clock
  end

  test "real times past midnight are refused" do
    patch time_block_path(@block), params: block_params(start_clock: "23:00", duration_minutes: "120")

    assert_response :unprocessable_entity
    assert_nil @block.reload.actual_start_clock
  end

  test "real times longer than 16 hours stay editable" do
    @block.update!(actual_start_clock: "01:00", actual_end_clock: "19:00")

    get edit_time_block_path(@block)
    assert_select "#time_block_duration_minutes[value='1080'][max='1439']"

    patch time_block_path(@block), params: block_params(
      title: "Longue journée", start_clock: "01:00", duration_minutes: "1080"
    )
    assert_response :redirect
    assert_equal "Longue journée", @block.reload.title
    assert_equal "19:00", @block.actual_end_clock
  end

  test "on a daylight-saving day the real end entered is the end saved" do
    spring = @user.time_blocks.create!(
      title: "Changement d'heure", category: "travail",
      start_at: Time.zone.local(2026, 3, 29, 1, 0),
      end_at: Time.zone.local(2026, 3, 29, 4, 0)
    )
    patch time_block_path(spring), params: {
      time_block: { title: spring.title, category: "travail", schedule_date: "2026-03-29",
                    start_clock: "01:00", duration_minutes: "200" }
    }

    assert_equal "01:00", spring.reload.actual_start_clock
    assert_equal "04:20", spring.actual_end_clock
  end

  test "a real pair across the clock change loads and saves its own clocks" do
    spring = @user.time_blocks.create!(
      title: "Nuit", category: "travail",
      start_at: Time.zone.local(2026, 3, 29, 1, 0),
      end_at: Time.zone.local(2026, 3, 29, 2, 0),
      actual_start_clock: "01:00", actual_end_clock: "04:00"
    )

    get edit_time_block_path(spring)
    assert_select "#time_block_duration_minutes[value='180']"

    patch time_block_path(spring), params: {
      time_block: { title: spring.title, category: "travail", schedule_date: "2026-03-29",
                    start_clock: "01:00", duration_minutes: "120" }
    }
    assert_equal "03:00", spring.reload.actual_end_clock
  end

  test "a real start late in the evening stays editable" do
    late = @user.time_blocks.create!(
      title: "Tard", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 11, 0),
      actual_start_clock: "23:00"
    )

    get edit_time_block_path(late)
    assert_select "#time_block_duration_minutes[value='59']"

    patch time_block_path(late), params: {
      time_block: { title: "Tard (titre)", category: "travail", schedule_date: "2026-11-02",
                    start_clock: "23:00", duration_minutes: "59" }
    }
    assert_response :redirect
    assert_equal "Tard (titre)", late.reload.title
    assert_nil late.actual_end_clock
  end

  test "historical actual minutes without clock times are not lost" do
    @block.update!(actual_minutes: 80)
    patch time_block_path(@block), params: block_params(title: "Montage")

    assert_equal 80, @block.reload.actual_minutes
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

  private

  # What the dialog sends unchanged for @block (09:00, 165 min).
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
