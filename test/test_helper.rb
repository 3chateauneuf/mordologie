ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

# Use one worker for deterministic isolation on the small Planner test DB.
class ActiveSupport::TestCase
  parallelize(workers: 1)

  # Most tests check the French interface: their users are created with
  # locale: "fr", and code run outside a request uses French too.
  # Spanish (the default) is covered by test/integration/locale_test.rb.
  setup { I18n.locale = :fr }
end
