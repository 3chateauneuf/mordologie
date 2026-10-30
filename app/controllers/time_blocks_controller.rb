class TimeBlocksController < ApplicationController
  before_action :find_block, only: [:edit, :update, :destroy]

  def new
    day = begin
      Date.iso8601(params.fetch(:day, Date.current.iso8601))
    rescue Date::Error
      Date.current
    end
    hour = params.fetch(:hour, 9).to_i.clamp(0, 22)
    start_time = Time.zone.local(day.year, day.month, day.day, hour)
    @block = current_user.time_blocks.new(
      start_at: start_time,
      end_at: start_time + 1.hour,
      category: "travail"
    )
  end

  def create
    @block = current_user.time_blocks.new(block_params)
    if @block.save
      redirect_to root_path(week: @block.start_at.to_date.iso8601), notice: "Créneau ajouté."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @block.update(block_params)
      redirect_to root_path(week: @block.start_at.to_date.iso8601), notice: "Créneau mis à jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    week = @block.start_at.in_time_zone.to_date.iso8601
    @block.destroy!
    redirect_to root_path(week: week), notice: "Créneau supprimé."
  end

  private

  def find_block
    @block = current_user.time_blocks.find(params[:id])
  end

  def block_params
    params.require(:time_block).permit(:title, :category, :start_at, :end_at, :notes, :actual_minutes)
  end
end
