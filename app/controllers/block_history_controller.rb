# Ctrl+Z / Ctrl+Shift+Z in the calendar (see public/scripts/calendar-history.js).
class BlockHistoryController < ApplicationController
  def undo
    result = BlockHistory.new(current_user).undo
    return back_to_calendar(alert: t("block_history.flash.nothing_to_undo")) unless result

    back_to_calendar(result, notice: t("block_history.flash.undone", change: result.change.label))
  end

  def redo
    result = BlockHistory.new(current_user).redo
    return back_to_calendar(alert: t("block_history.flash.nothing_to_redo")) unless result

    back_to_calendar(result, notice: t("block_history.flash.redone", change: result.change.label))
  end

  private

  # Show the day where the block now is (or was, if it was removed).
  # With nothing to undo, stay on the day being viewed.
  def back_to_calendar(result = nil, **flash)
    day = day_of(result)&.iso8601 || viewed_day
    redirect_to root_path(week: day, day: day), **flash
  end

  def viewed_day
    params[:day].to_s if params[:day].to_s.match?(/\A\d{4}-\d{2}-\d{2}\z/)
  end

  def day_of(result)
    return nil unless result
    return result.block.start_at.in_time_zone.to_date if result.block

    state = result.change.state_after
    Time.zone.parse(state.fetch("start_at")).to_date
  end
end
