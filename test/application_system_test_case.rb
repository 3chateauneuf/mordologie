require "test_helper"
require "capybara/rails"
require "selenium-webdriver"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1440, 900]

  setup do
    # Capybara can reuse a Chrome session between tests. Always restore
    # a desktop viewport before each test; mobile tests resize explicitly.
    page.driver.browser.manage.window.resize_to(1440, 900)
  end

  # Real browser tests use an isolated PostgreSQL database in CI.
  # Capture screenshots of fixtures only; never point these tests at production.
  def screenshot(name)
    path = Rails.root.join("tmp/screenshots/#{name}.png")
    FileUtils.mkdir_p(path.dirname)
    page.save_screenshot(path.to_s)
  end

  def login
    visit connexion_path
    fill_in "Email", with: @user.email
    fill_in "Mot de passe", with: "test-password-1234"
    click_button "Se connecter"
    assert_current_path root_path
  end

  def position(selector)
    page.evaluate_script(<<~JS)
      (() => {
        const rect = document.querySelector(#{selector.to_json}).getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
      })()
    JS
  end
end
