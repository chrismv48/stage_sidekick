class CreateCharactersLines < ActiveRecord::Migration[5.0]
  def change
    create_table :characters_lines do |t|
      t.belongs_to :line, null: false
      t.belongs_to :character, null: false

      t.timestamps
    end
  end
end
