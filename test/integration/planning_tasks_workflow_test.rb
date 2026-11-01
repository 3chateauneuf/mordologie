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

  test "direct drop schedules the saved task immediately, without a create dialog" do
    task = @user.planning_tasks.create!(
      title: "Préparer une proposition", category: "personnel",
      estimated_minutes: 45, notes: "Version client"
    )

    assert_difference("@user.time_blocks.count", 1) do
      post schedule_planning_task_path(task), params: {
        schedule_date: "2026-11-02", start_clock: "10:15",
        week: "2026-11-02", day: "2026-11-02"
      }
    end

    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    block = task.reload.scheduled_block
    assert_equal "Préparer une proposition", block.title
    assert_equal "personnel", block.category
    assert_equal "Version client", block.notes
    assert_equal "10:15", block.start_at.in_time_zone.strftime("%H:%M")
    assert_equal "11:00", block.end_at.in_time_zone.strftime("%H:%M")
    assert_equal 45, block.duration_minutes

    get root_path(week: "2026-11-02")
    assert_select ".day-body .event", text: /Préparer une proposition/
    assert_select ".pending-task[data-pending-task-id='#{task.id}']", count: 0
  end

  test "dropping a second time does not create another block" do
    task = @user.planning_tasks.create!(
      title: "Un seul bloc", category: "travail", estimated_minutes: 30
    )
    attrs = { schedule_date: "2026-11-02", start_clock: "08:30" }
    post schedule_planning_task_path(task), params: attrs
    first = task.reload.scheduled_block_id
    assert_not_nil first

    assert_no_difference("@user.time_blocks.count") do
      post schedule_planning_task_path(task), params: attrs.merge(start_clock: "09:00")
    end
    assert_equal first, task.reload.scheduled_block_id
    assert_redirected_to root_path
    assert_match(/déjà planifiée/, flash[:alert])
  end

  test "an invalid drop keeps the task pending and gives a useful explanation" do
    task = @user.planning_tasks.create!(
      title: "Quatre-vingt-dix minutes", category: "travail",
      estimated_minutes: 90
    )

    [
      { schedule_date: "2026-11-02", start_clock: "23:00" },
      { schedule_date: "invalid", start_clock: "08:00" },
      { schedule_date: "2026-11-02", start_clock: "08:07" }
    ].each do |attrs|
      assert_no_difference("@user.time_blocks.count") do
        post schedule_planning_task_path(task), params: attrs
      end
      assert_redirected_to root_path
      assert_predicate flash[:alert], :present?
      assert_nil task.reload.scheduled_block_id
    end
  end

  test "existing overlapping block remains unchanged and warning is shown" do
    previous = @user.time_blocks.create!(
      title: "Travail existant", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    task = @user.planning_tasks.create!(
      title: "Second créneau", category: "reunion", estimated_minutes: 30
    )

    assert_difference("@user.time_blocks.count", 1) do
      post schedule_planning_task_path(task), params: {
        schedule_date: "2026-11-02", start_clock: "09:15"
      }
    end

    assert_match(/chevauche/, flash[:notice])
    assert_equal "09:00", previous.reload.start_at.in_time_zone.strftime("%H:%M")
    assert_equal "10:00", previous.end_at.in_time_zone.strftime("%H:%M")
  end

  test "dragging a standalone calendar block to the inbox preserves its details" do
    block = @user.time_blocks.create!(
      title: "Étudier le projet", category: "reunion",
      notes: "Appeler le client", tags: ["client", "budget"],
      actual_minutes: 12,
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 15)
    )

    assert_difference("@user.planning_tasks.count", 1) do
      assert_difference("@user.time_blocks.count", -1) do
        post return_to_inbox_time_block_path(block), params: {
          week: "2026-11-02", day: "2026-11-03"
        }
      end
    end

    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-03")
    task = @user.planning_tasks.last
    assert_nil task.scheduled_block_id
    assert_equal "Étudier le projet", task.title
    assert_equal "reunion", task.category
    assert_equal 75, task.estimated_minutes
    assert_equal "Appeler le client", task.notes
    assert_equal ["client", "budget"], task.tags
    assert_equal 12, task.actual_minutes

    get root_path(week: "2026-11-02")
    assert_select ".pending-task[data-pending-task-id='#{task.id}']", count: 1
    assert_select ".day-body .event", text: /Étudier le projet/, count: 0

    assert_difference("@user.time_blocks.count", 1) do
      post schedule_planning_task_path(task), params: {
        schedule_date: "2026-11-03", start_clock: "08:15"
      }
    end
    scheduled = task.reload.scheduled_block
    assert_equal 75, scheduled.duration_minutes
    assert_equal ["client", "budget"], scheduled.tags
    assert_equal 12, scheduled.actual_minutes
    assert_equal "Appeler le client", scheduled.notes
  end

  test "returning a linked block reuses the same pending task" do
    task = @user.planning_tasks.create!(
      title: "Livraison", category: "travail", estimated_minutes: 30
    )
    post schedule_planning_task_path(task), params: {
      schedule_date: "2026-11-02", start_clock: "11:00"
    }
    block = task.reload.scheduled_block
    block.update!(
      title: "Livraison finalisée", notes: "Vérifié",
      tags: ["important"], actual_minutes: 24
    )

    assert_no_difference("@user.planning_tasks.count") do
      assert_difference("@user.time_blocks.count", -1) do
        post return_to_inbox_time_block_path(block), params: {
          week: "2026-11-02", day: "2026-11-02"
        }
      end
    end

    task.reload
    assert_nil task.scheduled_block_id
    assert_equal "Livraison finalisée", task.title
    assert_equal ["important"], task.tags
    assert_equal 24, task.actual_minutes
    assert_equal "Vérifié", task.notes
  end

  test "return rejects foreign blocks and duplicate submissions" do
    another = User.create!(
      email: "inbox-isolation@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    private_block = another.time_blocks.create!(
      title: "Privé", category: "personnel",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 9, 30)
    )
    assert_no_difference("PlanningTask.count") do
      post return_to_inbox_time_block_path(private_block)
      assert_response :not_found
    end
    assert_predicate private_block.reload, :persisted?

    mine = @user.time_blocks.create!(
      title: "Calendrier", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
    post return_to_inbox_time_block_path(mine)
    assert_response :redirect
    assert_no_difference("@user.planning_tasks.count") do
      post return_to_inbox_time_block_path(mine)
      assert_response :not_found
    end
  end

  test "explicitly deleting a standalone block does not create a pending task" do
    block = @user.time_blocks.create!(
      title: "Supprimer", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 12, 0),
      end_at: Time.zone.local(2026, 11, 2, 12, 30)
    )
    assert_no_difference("@user.planning_tasks.count") do
      assert_difference("@user.time_blocks.count", -1) do
        delete time_block_path(block)
      end
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
      post schedule_planning_task_path(task), params: {
        schedule_date: "2026-11-02", start_clock: "09:00"
      }
      assert_response :not_found
    end
  end
end
