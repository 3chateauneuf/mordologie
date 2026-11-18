class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :require_login
  around_action :switch_locale
  helper_method :current_user

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  # Signed in: the person's chosen language.
  # Signed out (login, setup): the browser's language when we have it.
  def switch_locale(&action)
    I18n.with_locale(current_user&.locale || browser_locale || I18n.default_locale, &action)
  end

  # "fr-FR,fr;q=0.9,en;q=0.8" -> "fr" (the first language we offer).
  def browser_locale
    languages = request.env["HTTP_ACCEPT_LANGUAGE"].to_s.split(",")
    languages.map { |entry| entry.strip[0, 2].downcase }
             .find { |code| User::LOCALES.include?(code) }
  end

  def require_login
    return if current_user
    redirect_to(User.exists? ? connexion_path : setup_path)
  end
end
