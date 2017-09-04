class AddCostumesCharactersScenesJoinTable < ActiveRecord::Migration[5.0]
  def change
    create_table :costumes_characters_scenes do |t|
      t.belongs_to :costume, index: true, null: false
      t.belongs_to :characters_scene, index: true, null: true
      t.belongs_to :character, index: true, null: true
      t.timestamps
    end
  end
end
