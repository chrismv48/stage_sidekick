class CreateScenes < ActiveRecord::Migration[5.0]
  def change
    create_table :scenes do |t|
      t.string :title, limit: 75, null: false
      t.belongs_to :production, index: true, null: false
      t.string :description, limit: 1000
      t.integer :order_index
      t.integer :length_in_minutes
      t.string :setting, limit: 30

      t.timestamps
    end
  end
end
