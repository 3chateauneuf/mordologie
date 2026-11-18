require "test_helper"

# Spanish is the default interface language; French can be chosen.
class LocaleTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "idioma@example.test",
      password: "test-password-1234",
      password_confirmation: "test-password-1234"
    )
    post session_path, params: { email: @user.email, password: "test-password-1234" }
    @user.time_blocks.create!(
      title: "Montaje", category: "travail",
      start_at: Time.zone.local(2026, 11, 2, 9, 0),
      end_at: Time.zone.local(2026, 11, 2, 10, 0)
    )
  end

  test "a new account sees the calendar in Spanish" do
    assert_equal "es", @user.locale

    get root_path(week: "2026-11-02")
    assert_response :success
    assert_select "html[lang='es']"
    assert_select "h1", text: /Mi semana/
    assert_select "#pending-tasks-heading", text: "Por planificar"
    assert_select ".day-heading em", text: "Lun"
    assert_select ".calendar-start-form select[name='locale'] option[selected]", text: "Español"
  end

  test "flash messages follow the chosen language" do
    post undo_block_change_path, params: { day: "2026-11-02" }
    assert_equal "No hay nada que deshacer.", flash[:alert]
  end

  test "French can be chosen and is kept" do
    patch calendar_preferences_path, params: { calendar_start_hour: "6", locale: "fr" }
    assert_equal "Préférences enregistrées.", flash[:notice]
    assert_equal "fr", @user.reload.locale

    get root_path(week: "2026-11-02")
    assert_select "html[lang='fr']"
    assert_select "h1", text: /Ma semaine/
    assert_select "#pending-tasks-heading", text: "À planifier"
  end

  test "an unknown language is refused" do
    patch calendar_preferences_path, params: { calendar_start_hour: "6", locale: "de" }

    assert_equal "Elige un idioma de la lista.", flash[:alert]
    assert_equal "es", @user.reload.locale
  end

  test "the browser scripts receive their texts" do
    get root_path(week: "2026-11-02")

    texts = JSON.parse(css_select("body").first["data-i18n"])
    assert_equal "Fin real", texts.fetch("end_actual")
  end

  test "signed out, the login page follows the browser language" do
    delete session_path

    get connexion_path, headers: { "Accept-Language" => "fr-FR,fr;q=0.9" }
    assert_select "h1", text: "Connexion"

    get connexion_path, headers: { "Accept-Language" => "en-US,en;q=0.9" }
    assert_select "h1", text: "Iniciar sesión"
  end
end
