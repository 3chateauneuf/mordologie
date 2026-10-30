Rails.application.config.session_store :cookie_store, key: "_planner_session", secure: Rails.env.production?, same_site: :lax
