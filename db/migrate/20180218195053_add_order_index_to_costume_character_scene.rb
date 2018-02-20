class AddOrderIndexToCostumeCharacterScene < ActiveRecord::Migration[5.0]
  def change
    add_column :costumes_characters_scenes, :order_index, :integer
  end
end
