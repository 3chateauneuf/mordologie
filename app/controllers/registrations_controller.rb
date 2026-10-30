class RegistrationsController < ApplicationController
  skip_before_action :require_login
  before_action :ensure_no_users

  def new
    @user = User.new
  end

  def create
    provided = params[:setup_token].to_s
    expected = ENV.fetch("PLANNER_SETUP_TOKEN", "")
    unless expected.present? && ActiveSupport::SecurityUtils.secure_compare(provided, expected)
      @user = User.new(user_params)
      flash.now[:alert] = "Code d'installation incorrect."
      return render :new, status: :unprocessable_entity
    end

    @user = User.new(user_params)
    if @user.save
      reset_session
      session[:user_id] = @user.id
      redirect_to root_path, notice: "Bienvenue dans Planner."
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def ensure_no_users
    redirect_to connexion_path if User.exists?
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
