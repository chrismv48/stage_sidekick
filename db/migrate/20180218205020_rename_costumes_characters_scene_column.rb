class RenameCostumesCharactersSceneColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :costumes_characters_scenes, :characters_scene_id, :scene_id
  end
end
