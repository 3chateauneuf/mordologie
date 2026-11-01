require "test_helper"

class TimeBlockDeletionTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "delete-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    post session_path, params: {
      email: @user.email,
      password: "test-password-1234"
    }
    assert_redirected_to root_path
  end

  test "edit offers reversible standby and permanent deletion for linked blocks" do
    task = pending_task
    block = schedule_task(task)

    get edit_time_block_path(block)
    assert_response :success
    assert_select "form[action='#{return_to_inbox_time_block_path(block)}'] button.editor-standby-button",
                  text: "Remettre en attente", count: 1
    assert_select "form[action='#{time_block_path(block)}'][data-confirm-destroy] button.editor-delete-button",
                  text: "Supprimer définitivement", count: 1
    assert_select "form[action='#{time_block_path(block)}'] input[name='_method'][value='delete']", count: 1
    assert_select "form[data-confirm-destroy]", count: 1
  end

  test "returning linked block to standby preserves the original task" do
    task = pending_task
    block = schedule_task(task)

    assert_difference("TimeBlock.count", -1) do
      assert_no_difference("PlanningTask.count") do
        post return_to_inbox_time_block_path(block)
      end
    end

    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    assert_nil task.reload.scheduled_block_id
    assert_equal "Préparer la réunion", task.title
  end

  test "permanent deletion removes the block and linked task together" do
    task = pending_task
    block = schedule_task(task)

    assert_difference("TimeBlock.count", -1) do
      assert_difference("PlanningTask.count", -1) do
        delete time_block_path(block)
      end
    end
    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    assert_match(/supprimée définitivement/, flash[:notice])
    assert_not TimeBlock.exists?(block.id)
    assert_not PlanningTask.exists?(task.id)

    get root_path(week: "2026-11-02")
    assert_select ".pending-task", text: /Préparer la réunion/, count: 0
    assert_select ".day-body .event", text: /Préparer la réunion/, count: 0
  end

  test "permanent deletion of standalone block does not create a pending task" do
    block = @user.time_blocks.create!(
      title: "Bloc autonome", category: "personnel",
      start_at: Time.zone.local(2026, 11, 2, 14, 0),
      end_at: Time.zone.local(2026, 11, 2, 14, 30)
    )
    get edit_time_block_path(block)
    assert_response :success
    assert_select ".editor-standby-button", count: 1
    assert_select ".editor-delete-button", count: 1

    assert_difference("TimeBlock.count", -1) do
      assert_no_difference("PlanningTask.count") do
        delete time_block_path(block)
      end
    end
  end

  test "another user's block cannot be deleted" do
    other = User.create!(
      email: "another-delete-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    task = other.planning_tasks.create!(
      title: "Privé", category: "travail", estimated_minutes: 45
    )
    block = other.time_blocks.create!(
      title: task.title, category: task.category,
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 9, 45)
    )
    task.update!(scheduled_block: block)

    assert_no_difference("TimeBlock.count") do
      assert_no_difference("PlanningTask.count") do
        delete time_block_path(block)
        assert_response :not_found
      end
    end
    assert_equal block.id, task.reload.scheduled_block_id
  end

  private

  def pending_task
    @user.planning_tasks.create!(
      title: "Préparer la réunion",
      category: "travail",
      estimated_minutes: 45
    )
  end

  def schedule_task(task)
    block = @user.time_blocks.create!(
      title: task.title, category: task.category,
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 9, 45)
    )
    task.update!(scheduled_block: block)
    block
  end
end
