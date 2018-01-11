class CreateLines < ActiveRecord::Migration[5.0]
  def change
    create_table :lines do |t|
      t.belongs_to :production, null: false
      t.belongs_to :scene
      t.integer :number
      t.integer :page_number
      t.string :line_type
      t.string :content
      t.string :status

      t.timestamps
    end
  end
end
