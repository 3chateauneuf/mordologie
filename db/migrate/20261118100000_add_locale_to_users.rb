class AddLocaleToUsers < ActiveRecord::Migration[8.0]
  # Interface language chosen by each person (see User::LOCALES).
  def change
    add_column :users, :locale, :string, limit: 5, null: false, default: "es"
  end
end
