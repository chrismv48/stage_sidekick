class CreateCharactersCostumes < ActiveRecord::Migration[5.0]
  def change
    create_table :characters_costumes do |t|
      t.belongs_to :character, index: true, null: false
      t.belongs_to :costume, index: true, null: false
      t.timestamps
    end
  end
end
