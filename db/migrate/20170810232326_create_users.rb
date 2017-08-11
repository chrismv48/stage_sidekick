class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :first_name, limit: 50, null: false
      t.string :last_name, limit: 50, null: false
      t.string :email, limit: 255, null: false
      t.string :username, limit: 20, null: false
      t.string :default_title, limit: 50

      t.timestamps
    end
  end
end
