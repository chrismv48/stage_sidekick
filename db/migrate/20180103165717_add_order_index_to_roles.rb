class AddOrderIndexToRoles < ActiveRecord::Migration[5.0]
  def change
    add_column :roles, :order_index, :integer
  end
end
