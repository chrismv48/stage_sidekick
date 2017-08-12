class AddToMemberTable < ActiveRecord::Migration[5.0]
  def change
    add_column :members, :email, :string, limit: 255
    add_column :members, :department, :string, limit: 50
    add_column :members, :status, :string, limit: 50
    add_column :members, :phone_number, :string, limit: 20
  end
end
