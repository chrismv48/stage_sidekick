class CreateMembers < ActiveRecord::Migration[5.0]
  def change
    create_table :members do |t|
      t.string :first_name, limit: 50
      t.string :last_name, limit: 50
      t.string :default_title, limit: 50
      t.timestamps
    end
  end
end
