require "test_helper"

# The "Épuré" calendar page: one top bar, totals per day, current-time line.
class EpureLayoutTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "epure@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    post session_path, params: { email: @user.email, password: "test-password-1234" }
  end

  test "the week, totals and actions live in a single bar" do
    get root_path(week: "2026-11-02")

    assert_select ".topbar .planner-toolbar", count: 1
    assert_select ".toolbar-range", text: "2 – 8 novembre"
    assert_select ".toolbar-totals", text: /Prévu\s+0 min/
    assert_select ".toolbar-actions a[href='#{recherche_path}']", count: 1
    assert_select ".toolbar-settings .settings-form select[name='calendar_start_hour']", count: 1
    assert_select ".toolbar-settings .settings-account", text: /epure@example.test/
    assert_select ".toolbar-new[title='+ Créneau'] .toolbar-new-full", text: "+ Créneau"
    # The previous header, stats cards and help paragraph are gone.
    assert_select ".page-head, .stats, .calendar-header, .help", count: 0
    assert_select ".topbar .nav-links", count: 0
  end

  test "a week spanning two months shows both" do
    get root_path(week: "2026-10-26")

    assert_select ".toolbar-range", text: "26 oct. – 1 nov."
  end

  test "each day heading shows real / planned, or only planned" do
    @user.time_blocks.create!(
      title: "Montage", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 11, 0),
      actual_start_clock: "09:00", actual_end_clock: "10:30"
    )
    @user.time_blocks.create!(
      title: "Tournage", category: "travail",
      start_at: Time.zone.local(2026, 11, 3, 9, 0),
      end_at: Time.zone.local(2026, 11, 3, 13, 0)
    )

    get root_path(week: "2026-11-02")

    assert_select ".day-heading .day-totals", text: "1 h 30 / 2 h"
    assert_select ".day-heading .day-totals", text: "Prévu : 4 h"
    assert_select ".day-heading .day-totals", count: 2
  end

  test "only today's column has the current-time line" do
    get root_path

    assert_select ".day-body.today [data-now-line][data-time-zone='Europe/Paris']", count: 1
    assert_select "[data-now-line]", count: 1
    assert_select "script[src^='/scripts/calendar-now-line.js?v=']", count: 1

    get root_path(week: "2026-11-02")
    assert_select "[data-now-line]", count: 0 unless Date.current.between?(Date.new(2026, 11, 2), Date.new(2026, 11, 8))
  end

  test "blocks explain their gestures on hover" do
    @user.time_blocks.create!(
      title: "Montage", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )

    get root_path(week: "2026-11-02")
    assert_select ".event[title*='Maj + glisser pour dupliquer']", count: 1
    assert_select ".event-resize-handle[title]", count: 1
  end

  test "other pages keep the usual navigation" do
    get recherche_path

    assert_select ".topbar .nav-links", count: 1
    assert_select ".planner-toolbar", count: 0
  end
end
