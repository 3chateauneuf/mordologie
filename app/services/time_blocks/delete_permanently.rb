module TimeBlocks
  # Permanently remove a scheduled activity and its linked planning task.
  #
  # The block and task are deleted in one transaction, so a failed deletion
  # cannot leave the task pointing to a missing calendar reservation.
  class DeletePermanently
    def initialize(block:)
      @block = block
    end

    def call
      @block.with_lock do
        @block.planning_task&.destroy!
        @block.destroy!
      end
    end
  end
end
