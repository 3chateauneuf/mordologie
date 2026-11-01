require "test_helper"

class PlanningTasksWorkflowTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "pending-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    post session_path, params: {
      email: @user.email,
      password: "test-password-1234"
    }
    assert_redirected_to root_path
  end

  test "create pending task and display it without a calendar reservation" do
    assert_difference("@user.planning_tasks.count", 1) do
      assert_no_difference("@user.time_blocks.count") do
        post planning_tasks_path, params: {
          planning_task: {
            title: "Préparer une présentation",
            estimated_minutes: "45",
            category: "travail"
          },
          week: "2026-11-02",
          day: "2026-11-03"
        }
      end
    end

    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-03")
    task = @user.planning_tasks.last
    assert_nil task.scheduled_block_id
    assert_equal 45, task.estimated_minutes

    get root_path(week: "2026-11-02")
    assert_response :success
    assert_select ".pending-task[data-pending-task-id='#{task.id}']", text: /Préparer une présentation/
    assert_select ".pending-task a[href*='planning_task_id=#{task.id}']", count: 1
    assert_select ".day-body .event", text: /Préparer une présentation/, count: 0
  end

  test "scheduling a pending task links exactly one block and unscheduling restores it" do
    task = @user.planning_tasks.create!(
      title: "Préparer une vidéo",
      category: "travail",
      estimated_minutes: 90,
      notes: "Plan"
    )

    get new_time_block_path(day: "2026-11-02", planning_task_id: task.id)
    assert_response :success
    assert_select "#time_block_title[value='Préparer une vidéo']", count: 1
    assert_select "#time_block_duration_minutes[value='90']", count: 1
    assert_select "input[name='planning_task_id'][value='#{task.id}']", count: 1

    attributes = {
      title: "Préparer une vidéo",
      category: "travail",
      notes: "Plan",
      schedule_date: "2026-11-02",
      start_clock: "10:00",
      duration_minutes: "90",
      tag_list: "video"
    }

    assert_difference("@user.time_blocks.count", 1) do
      post time_blocks_path, params: { planning_task_id: task.id, time_block: attributes }
    end
    assert_response :redirect

    block = @user.time_blocks.last
    assert_equal block.id, task.reload.scheduled_block_id
    assert_equal 90, block.duration_minutes

    get root_path(week: "2026-11-02")
    assert_response :success
    assert_select ".pending-task[data-pending-task-id='#{task.id}']", count: 0
    assert_select ".day-body .event", text: /Préparer une vidéo/

    assert_no_difference("@user.time_blocks.count") do
      post time_blocks_path, params: { planning_task_id: task.id, time_block: attributes }
    end
    assert_response :unprocessable_entity
    assert_select ".editor-error", text: /déjà planifiée/

    patch time_block_path(block), params: {
      time_block: attributes.merge(title: "Montage final", duration_minutes: "30")
    }
    assert_response :redirect

    assert_difference("@user.time_blocks.count", -1) do
      assert_no_difference("@user.planning_tasks.count") do
        delete time_block_path(block)
      end
    end

    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    task.reload
    assert_nil task.scheduled_block_id
    assert_equal "Montage final", task.title
    assert_equal 30, task.estimated_minutes
    assert_equal "Plan", task.notes

    get root_path(week: "2026-11-02")
    assert_select ".pending-task[data-pending-task-id='#{task.id}']", text: /Montage final/
  end

  test "an invalid schedule does not consume a pending task" do
    task = @user.planning_tasks.create!(
      title: "Préparer un atelier", category: "travail", estimated_minutes: 60
    )
    assert_no_difference("@user.time_blocks.count") do
      post time_blocks_path, params: {
        planning_task_id: task.id,
        time_block: {
          title: task.title,
          category: task.category,
          schedule_date: "2026-11-02",
          start_clock: "23:45",
          duration_minutes: "60"
        }
      }
    end
    assert_response :unprocessable_entity
    assert_nil task.reload.scheduled_block_id
  end

  test "pending tasks reject invalid input and may be deleted only while pending" do
    assert_no_difference("@user.planning_tasks.count") do
      post planning_tasks_path, params: {
        planning_task: { title: "", category: "not-valid", estimated_minutes: "2000" }
      }
    end
    assert_response :redirect

    task = @user.planning_tasks.create!(
      title: "Une tâche", category: "personnel", estimated_minutes: 15
    )
    assert_difference("@user.planning_tasks.count", -1) do
      delete planning_task_path(task)
    end
  end

  test "a task belonging to another account cannot be scheduled" do
    other = User.create!(
      email: "other-pending-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    task = other.planning_tasks.create!(
      title: "Privé", category: "travail", estimated_minutes: 60
    )
    assert_no_difference("@user.time_blocks.count") do
      get new_time_block_path(planning_task_id: task.id)
      assert_response :not_found
    end
  end
end
