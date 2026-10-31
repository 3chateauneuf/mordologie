class User < ApplicationRecord
  DEFAULT_CALENDAR_START_HOUR = 6
  CALENDAR_START_HOURS = (0..23).freeze

  has_secure_password
  has_many :time_blocks, dependent: :destroy

  before_validation do
    self.email = email.to_s.strip.downcase
  end

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 12 }, if: -> { password.present? }
  validates :calendar_start_hour, inclusion: { in: CALENDAR_START_HOURS }
end
