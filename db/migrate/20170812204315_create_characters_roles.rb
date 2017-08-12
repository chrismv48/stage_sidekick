class CreateCharactersRoles < ActiveRecord::Migration[5.0]
  def change
    create_table :characters_roles do |t|
      t.belongs_to :role, index: true, null: false
      t.belongs_to :character, index: true, null: false
      t.timestamps
    end
  end
end
