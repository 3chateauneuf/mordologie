FROM ruby:3.3-slim
RUN apt-get update -qq && apt-get install -y --no-install-recommends build-essential libpq-dev ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV RAILS_ENV=production BUNDLE_WITHOUT=development:test
COPY Gemfile ./
RUN bundle install --jobs 4 --retry 3
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "bundle exec rails db:prepare && bundle exec puma -C config/puma.rb"]
