require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module Planner
  class Application < Rails::Application
    config.load_defaults 8.0
    config.time_zone = "Paris"
    config.active_record.default_timezone = :utc
    config.active_job.queue_adapter = :async
    config.i18n.default_locale = :fr
    config.autoload_paths << Rails.root.join("app", "models")
    config.generators.system_tests = nil
  end
end
