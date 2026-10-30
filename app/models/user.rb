class User < ApplicationRecord
  has_secure_password
  has_many :time_blocks, dependent: :destroy

  before_validation do
    self.email = email.to_s.strip.downcase
  end

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 12 }, if: -> { password.present? }
end
