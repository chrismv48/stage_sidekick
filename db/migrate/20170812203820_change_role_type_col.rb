class ChangeRoleTypeCol < ActiveRecord::Migration[5.0]
  def change
    rename_column :roles, :type, :role_type
  end
end
