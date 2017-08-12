class AddProductionDepToCharacters < ActiveRecord::Migration[5.0]
  def change
    add_column :characters, :production_id, :integer, null: false, index: true, after: :name
  end
end
