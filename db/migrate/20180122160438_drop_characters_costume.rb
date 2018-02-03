class DropCharactersCostume < ActiveRecord::Migration[5.0]
  def change
    drop_table :characters_costumes
  end
end
