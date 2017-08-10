class CreateProductions < ActiveRecord::Migration[5.0]
  def change
    create_table :productions do |t|
      t.string :title, limit: 50, null: false
      t.belongs_to :venue, index: true, null: false
      t.string :status, limit: 15
      t.date :start_date
      t.date :end_date
      t.timestamps
    end
  end
end
