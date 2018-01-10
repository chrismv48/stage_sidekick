class CreateLines < ActiveRecord::Migration[5.0]
  def change
    create_table :lines do |t|
      t.belongs_to :scene
      t.integer :number
      t.integer :page_number
      t.string :status

      t.timestamps
    end
  end
end
