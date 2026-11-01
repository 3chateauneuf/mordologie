class PlanningTasksController < ApplicationController
  before_action :load_task, only: :destroy

  def create
    @task = current_user.planning_tasks.new(task_params)

    if @task.save
      redirect_to root_path, notice: "Ajouté aux choses à planifier."
    else
      redirect_to root_path, alert: @task.errors.full_messages.to_sentence
    end
  end

  def destroy
    if @task.scheduled?
      redirect_to root_path, alert: "Retirez d'abord cette activité du planning."
    else
      @task.destroy!
      redirect_to root_path, notice: "Tâche supprimée."
    end
  end

  private

  def load_task
    @task = current_user.planning_tasks.find(params[:id])
  end

  def task_params
    params.require(:planning_task).permit(:title, :category, :estimated_minutes, :notes)
  end
end
