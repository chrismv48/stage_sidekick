class AddNameFieldsToRole < ActiveRecord::Migration[5.0]
  def change
    add_column :roles, :first_name, :string
    add_column :roles, :last_name, :string
  end
end
