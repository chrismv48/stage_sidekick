class AddAvatarToRoles < ActiveRecord::Migration[5.0]
  def change
    add_column :roles, :avatar, :string
  end
end
