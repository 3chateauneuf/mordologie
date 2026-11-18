require "test_helper"

# Every language must have exactly the same texts: a key added in one file
# and forgotten in the other would show up untranslated.
class LocaleFilesTest < ActiveSupport::TestCase
  test "es.yml and fr.yml have the same keys" do
    spanish = keys_of(Rails.root.join("config/locales/es.yml"), "es")
    french = keys_of(Rails.root.join("config/locales/fr.yml"), "fr")

    assert_empty spanish - french, "Missing in fr.yml"
    assert_empty french - spanish, "Missing in es.yml"
  end

  test "every offered language has its file" do
    User::LOCALES.each do |code|
      assert Rails.root.join("config/locales/#{code}.yml").exist?, "config/locales/#{code}.yml"
    end
  end

  private

  def keys_of(path, language)
    flatten(YAML.load_file(path).fetch(language))
  end

  def flatten(hash, prefix = nil)
    hash.flat_map do |key, value|
      path = [prefix, key].compact.join(".")
      value.is_a?(Hash) ? flatten(value, path) : [path]
    end
  end
end
