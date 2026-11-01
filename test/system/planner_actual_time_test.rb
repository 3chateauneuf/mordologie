require "application_system_test_case"

class PlannerActualTimeTest < ApplicationSystemTestCase
  setup do
    @user = User.create!(
      email: "browser-actual-time@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    @block = @user.time_blocks.create!(
      title: "Montage réel", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 11, 45)
    )
    login
  end

  test "entering actual start and end previews and saves the precise duration" do
    visit edit_time_block_path(@block)
    find(".editor-details > summary").click

    fill_in "Début réel", with: "14:11"
    fill_in "Fin réelle", with: "17:38"

    assert_selector "[data-actual-preview]", text: "Durée réelle : 3 h 27"
    click_button "Enregistrer"
    assert_selector ".day-body .event", text: "Montage réel"

    assert_equal 207, @block.reload.actual_minutes
    assert_equal "14:11", @block.actual_start_clock
    assert_equal "17:38", @block.actual_end_clock
    assert_equal 165, @block.duration_minutes

    visit edit_time_block_path(@block)
    assert_field "Début réel", with: "14:11"
    assert_field "Fin réelle", with: "17:38"
    assert_selector "[data-actual-preview]", text: "3 h 27"
  end

  test "invalid order shows feedback and never overwrites saved values" do
    visit edit_time_block_path(@block)
    find(".editor-details > summary").click

    fill_in "Début réel", with: "17:38"
    fill_in "Fin réelle", with: "14:11"
    assert_selector "[data-actual-preview]", text: /La fin doit être après le début/
    assert_not page.find("#time_block_actual_end_clock").valid?
    assert_nil @block.reload.actual_minutes
  end
end
