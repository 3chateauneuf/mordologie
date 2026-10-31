require "test_helper"

class TimeBlockTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "test-owner@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
  end

  test "duration and category remain separate from tags" do
    block = valid_block
    block.tag_list = " #Youtube, Projet, youtube,  "
    assert block.valid?, block.errors.full_messages.join(", ")
    assert_equal ["youtube", "projet"], block.tags
    assert_equal 45, block.duration_minutes
    assert_equal "travail", block.category
  end

  test "block must end after its start on the same day" do
    block = valid_block
    block.end_at = block.start_at
    assert_not block.valid?

    block.end_at = Time.zone.local(2026, 11, 3, 0, 10)
    assert_not block.valid?
    assert block.errors[:end_at].any?
  end

  test "too many tags are rejected" do
    block = valid_block
    block.tag_list = (1..13).map { |n| "tag#{n}" }.join(",")
    assert_not block.valid?
    assert block.errors[:tags].any?
  end

  private

  def valid_block
    TimeBlock.new(
      user: @user,
      title: "Écrire un script",
      category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 9, 45)
    )
  end
end
