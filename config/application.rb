require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module Planner
  class Application < Rails::Application
    config.load_defaults 8.0
    config.time_zone = "Paris"
    config.active_record.default_timezone = :utc
    config.active_job.queue_adapter = :async
    # Interface languages. Each person picks theirs in the calendar settings;
    # texts live in config/locales/<language>.yml.
    config.i18n.available_locales = [:es, :fr]
    config.i18n.default_locale = :es
    config.autoload_paths << Rails.root.join("app", "models")
    config.generators.system_tests = nil
  end
end
