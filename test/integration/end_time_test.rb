require "test_helper"

class EndTimeTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "end-time-http@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    post session_path, params: { email: @user.email, password: "test-password-1234" }
    @block = @user.time_blocks.create!(
      title: "Montage", category: "work",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
  end

  test "saving a real end redirects to the block's day" do
    travel_to Time.zone.local(2026, 11, 2, 12, 0) do
      patch end_time_time_block_path(@block), params: { end_clock: "11:40" }
    end

    assert_redirected_to root_path(week: "2026-11-02", day: "2026-11-02")
    assert_equal "Fin réelle : 11:40.", flash[:notice]
    assert_equal "11:40", @block.reload.actual_end_clock
  end

  test "the calendar shows the real end and the editable end time" do
    @block.update!(actual_start_clock: "09:00", actual_end_clock: "11:40")

    get root_path(week: "2026-11-02", day: "2026-11-02")
    assert_select ".event[data-calendar-block-id='#{@block.id}'] .event-end-time", text: "11:40"
    assert_select ".event-planned-ghost", count: 1
    assert_select ".calendar-end-time-form[data-end-time-block-id='#{@block.id}']", count: 1
  end

  test "another user's block cannot be changed" do
    other = User.create!(
      email: "other@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    foreign = other.time_blocks.create!(
      title: "Privé", category: "work",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )

    patch end_time_time_block_path(foreign), params: { end_clock: "11:00" }
    assert_response :not_found
    assert_nil foreign.reload.actual_end_clock
  end
end
