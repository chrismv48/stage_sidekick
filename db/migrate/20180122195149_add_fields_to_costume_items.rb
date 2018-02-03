class AddFieldsToCostumeItems < ActiveRecord::Migration[5.0]
  def change
    add_column :costume_items, :care_instructions, :string
    add_column :costume_items, :source, :string
    add_column :costume_items, :brand, :string
    add_column :costume_items, :cost, :float
    add_column :costume_items, :notes, :string
  end
end
