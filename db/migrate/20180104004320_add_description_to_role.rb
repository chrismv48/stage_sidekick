class AddDescriptionToRole < ActiveRecord::Migration[5.0]
  def change
    add_column :roles, :description, :string
  end
end
