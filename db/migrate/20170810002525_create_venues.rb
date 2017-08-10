class CreateVenues < ActiveRecord::Migration[5.0]
  def change
    create_table :venues do |t|
      t.string :name, limit: 100, null: false
      t.string :description, limit: 5000
      t.string :type, limit: 30
      t.timestamps
    end
  end
end
