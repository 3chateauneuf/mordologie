module PlanningTasks
  # Return a calendar reservation to the inbox without losing its contents.
  #
  # Linked reservations update the same task. Standalone reservations first
  # create a task, then remove the block, in one database transaction.
  class ReturnToInbox
    def initialize(block:)
      @block = block
    end

    def call
      @block.with_lock do
        task = @block.planning_task

        if task
          task.update_from_block!(@block)
        else
          task = @block.user.planning_tasks.create!(
            title: @block.title,
            category: @block.category,
            estimated_minutes: @block.duration_minutes,
            notes: @block.notes,
            tags: @block.tags,
            actual_minutes: @block.actual_minutes,
            actual_start_clock: @block.actual_start_clock,
            actual_end_clock: @block.actual_end_clock
          )
        end

        @block.destroy!
        task
      end
    end
  end
end
