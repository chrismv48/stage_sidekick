class CreateCostumeItems < ActiveRecord::Migration[5.0]
  def change
    create_table :costume_items do |t|
      t.belongs_to :costume, index: true
      t.string :title
      t.string :description
      t.string :item_type
      t.string :display_image
      t.timestamps
    end
  end
end
