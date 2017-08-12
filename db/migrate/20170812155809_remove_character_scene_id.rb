class RemoveCharacterSceneId < ActiveRecord::Migration[5.0]
  def change
    remove_column :characters, :scene_id
  end
end
