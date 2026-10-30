max_threads_count = Integer(ENV.fetch("RAILS_MAX_THREADS", 5))
min_threads_count = Integer(ENV.fetch("RAILS_MIN_THREADS", 2))
threads min_threads_count, max_threads_count
port ENV.fetch("PORT", 3000)
environment ENV.fetch("RAILS_ENV", "production")
plugin :tmp_restart
