module PlannerCalendar
  # Position every block of one calendar day.
  #
  # Blocks are drawn with their real times when they exist (see
  # TimeBlock#displayed_start_at). When blocks overlap, the column is split
  # into side-by-side lanes so that none hides another.
  class DayLayout
    PIXELS_PER_MINUTE = 1.1 # One grid hour is 66 px.
    MIN_HEIGHT = 34

    Entry = Struct.new(:block, :top, :height, :lane, :lanes,
                       :planned_top, :planned_height, :finish_now,
                       keyword_init: true) do
      def start_label
        block.displayed_start_at.in_time_zone.strftime("%H:%M")
      end

      def end_label
        block.displayed_end_at.in_time_zone.strftime("%H:%M")
      end

      def planned_label
        "#{block.start_at.in_time_zone.strftime('%H:%M')} – #{block.end_at.in_time_zone.strftime('%H:%M')}"
      end

      # A dashed outline shows the planned slot when the real one differs.
      def planned_ghost?
        !planned_top.nil?
      end

      # Too short for two lines: title and times share one line.
      def compact?
        height < 46
      end

      def finish_now?
        finish_now
      end
    end

    def initialize(blocks:, day:, start_hour:, calendar_height:, now: Time.current)
      @day = day
      @visible_start = day.in_time_zone + start_hour.hours
      @calendar_height = calendar_height
      @now = now
      @blocks = blocks.select { |block| block.displayed_end_at > @visible_start }
                      .sort_by { |block| [block.displayed_start_at, block.displayed_end_at] }
    end

    def entries
      @entries ||= begin
        lanes = assign_lanes
        in_progress = in_progress_block
        @blocks.map do |block|
          lane, lane_count = lanes.fetch(block)
          top, height = position(block.displayed_start_at, block.displayed_end_at)
          if block.shows_actual_time? && block.end_at > @visible_start
            planned_top, planned_height = position(block.start_at, block.end_at)
          end
          Entry.new(block: block, top: top, height: height,
                    lane: lane, lanes: lane_count,
                    planned_top: planned_top, planned_height: planned_height,
                    finish_now: block == in_progress)
        end
      end
    end

    private

    # Groups of blocks that overlap (directly or through each other) share
    # the same number of lanes; each block takes the first free lane.
    def assign_lanes
      result = {}
      group = []
      group_end = nil

      @blocks.each do |block|
        if group_end && block.displayed_start_at >= group_end
          place(group, result)
          group = []
          group_end = nil
        end
        group << block
        group_end = [group_end, block.displayed_end_at].compact.max
      end
      place(group, result)
      result
    end

    def place(group, result)
      lane_ends = []
      lane_of = group.to_h do |block|
        lane = lane_ends.index { |finish| finish <= block.displayed_start_at } || lane_ends.length
        lane_ends[lane] = block.displayed_end_at
        [block, lane]
      end
      lane_of.each { |block, lane| result[block] = [lane, lane_ends.length] }
    end

    # "Terminer maintenant" belongs to the task in progress: the last block
    # of today that has started and has no real end yet.
    def in_progress_block
      return nil unless @day == @now.to_date

      @blocks.select { |block| block.started?(@now) && block.actual_end_clock.blank? }
             .max_by(&:displayed_start_at)
    end

    def position(starts, ends)
      visible_from = [starts, @visible_start].max
      top = ((visible_from - @visible_start) / 60) * PIXELS_PER_MINUTE
      height = ((ends - visible_from) / 60) * PIXELS_PER_MINUTE
      [top, [[height, MIN_HEIGHT].max, [@calendar_height - top, 15].max].min]
    end
  end
end
