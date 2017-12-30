class ChangeRoleFields < ActiveRecord::Migration[5.0]
  def change
    change_table :roles do |t|
      t.remove :role_type
    end
  end
end
