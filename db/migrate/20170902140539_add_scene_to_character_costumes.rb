class AddSceneToCharacterCostumes < ActiveRecord::Migration[5.0]
  def change
    add_reference :characters_costumes, :scene, index: true, null: true
  end
end
