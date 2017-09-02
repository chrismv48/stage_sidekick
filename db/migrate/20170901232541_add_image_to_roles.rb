class AddImageToRoles < ActiveRecord::Migration[5.0]
  def change
    add_column :roles, :display_image, :string
  end
end
