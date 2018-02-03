class AddTypeToRolesTable < ActiveRecord::Migration[5.0]
  def change
    add_column :roles, :type, :string
  end
end
