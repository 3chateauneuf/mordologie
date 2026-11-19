require "test_helper"

class SearchTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "search@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234",
      locale: "fr"
    )
    post session_path, params: { email: @user.email, password: "test-password-1234" }
    @user.time_blocks.create!(
      title: "Montage vidéo", category: "work", tags: ["youtube"],
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
  end

  test "search finds blocks by title and shows how many" do
    get recherche_path(q: "montage")

    assert_response :success
    assert_select "h2", text: "Activités trouvées (1)"
    assert_select ".result strong", text: "Montage vidéo"
    assert_select ".result small", text: /02\/11\/2026 09:00 · 60 min · Travail/
  end

  test "search page works in Spanish" do
    @user.update!(locale: "es")
    get recherche_path(tag: "youtube")

    assert_response :success
    assert_select "h1", text: "Buscar una actividad"
    assert_select "h2", text: "Actividades encontradas (1)"
    assert_select ".result small", text: /Trabajo/
  end

  test "an empty search says so" do
    get recherche_path(q: "rien")

    assert_select "h2", text: "Activités trouvées (0)"
    assert_select ".muted", text: "Aucun créneau trouvé avec ces critères."
  end
end
