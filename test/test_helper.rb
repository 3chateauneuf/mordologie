ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

# Use one worker for deterministic isolation on the small Planner test DB.
class ActiveSupport::TestCase
  parallelize(workers: 1)
end
