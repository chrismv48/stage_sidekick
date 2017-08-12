class CreateCharactersScenes < ActiveRecord::Migration[5.0]
  def change
    create_table :characters_scenes do |t|
      t.belongs_to :character, null: false, index: true
      t.belongs_to :scene, null: false, index: true
      t.timestamps
    end
  end
end
