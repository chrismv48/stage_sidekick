class AddOrderIndexToImages < ActiveRecord::Migration[5.0]
  def change
    add_column :images, :order_index, :integer
  end
end
