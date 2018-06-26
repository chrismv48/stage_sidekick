class ModifyCostumesCharactersScenes < ActiveRecord::Migration[5.0]
  def change
    rename_table :costumes_characters_scenes, :character_costumes
    remove_column :character_costumes, :scene_id
  end
end
