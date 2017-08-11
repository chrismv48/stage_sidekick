class CreateCharacters < ActiveRecord::Migration[5.0]
  def change
    create_table :characters do |t|
      t.string :name, limit:50, null: false
      t.belongs_to :scene, index: true, null: false
      t.string :description, limit: 1000
      t.string :type, limit: 20
      t.timestamps
    end
  end
end
