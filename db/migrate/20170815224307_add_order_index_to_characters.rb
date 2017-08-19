class AddOrderIndexToCharacters < ActiveRecord::Migration[5.0]
  def change
    add_column :characters, :order_index, :integer
  end
end
