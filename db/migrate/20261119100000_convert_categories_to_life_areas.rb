# Categories become three areas of life: work, life and learning.
#
# Old category  -> area  (+ tag that keeps the old meaning)
#   travail     -> travail
#   reunion     -> travail  + #reunión (fr: #réunion)
#   personnel   -> vie
#   pause       -> vie      + #pausa   (fr: #pause)
#
# Both the calendar blocks and the pending tasks are converted. The tag is
# written in the owner's language and only added if the block has room for
# it (12 tags at most) and does not already have it.
class ConvertCategoriesToLifeAreas < ActiveRecord::Migration[8.0]
  TAGS = {
    "reunion" => { "es" => "reunión", "fr" => "réunion" },
    "pause" => { "es" => "pausa", "fr" => "pause" }
  }.freeze

  def up
    %w[time_blocks planning_tasks].each do |table|
      TAGS.each do |old_category, tag_by_locale|
        tag_by_locale.each do |locale, tag|
          execute <<~SQL
            UPDATE #{table}
            SET tags = array_append(tags, #{quote(tag)})
            FROM users
            WHERE users.id = #{table}.user_id
              AND #{table}.category = #{quote(old_category)}
              AND users.locale = #{quote(locale)}
              AND NOT (#{quote(tag)} = ANY(tags))
              AND cardinality(tags) < 12
          SQL
        end
      end

      execute "UPDATE #{table} SET category = 'travail' WHERE category = 'reunion'"
      execute "UPDATE #{table} SET category = 'vie' WHERE category IN ('personnel', 'pause')"
    end
  end

  def down
    # Meetings and breaks cannot be told apart from other work and life
    # blocks once converted, except through their tags.
    raise ActiveRecord::IrreversibleMigration
  end

  private

  def quote(value)
    connection.quote(value)
  end
end
