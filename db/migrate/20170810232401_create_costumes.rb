class CreateCostumes < ActiveRecord::Migration[5.0]
  def change
    create_table :costumes do |t|
      t.string :title, limit: 75, null: false
      t.string :description, limit: 1000
      t.belongs_to :production, index: true, null: false
      t.timestamps
    end
  end
end
