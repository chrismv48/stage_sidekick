class ChangeRoleTypeCol < ActiveRecord::Migration[5.0]
  def change
    rename_column :roles, :type, :type
  end
end
