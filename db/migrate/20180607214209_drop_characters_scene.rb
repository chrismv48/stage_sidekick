class DropCharactersScene < ActiveRecord::Migration[5.0]
  def change
    drop_table :characters_scenes
  end
end
