Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = ENV["CI"].present?
  config.consider_all_requests_local = true
  config.action_controller.allow_forgery_protection = false
  config.active_storage.service = :test
  # A text missing from config/locales fails the test instead of showing
  # "translation missing" in the interface.
  config.i18n.raise_on_missing_translations = true
end
