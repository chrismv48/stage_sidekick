class AddImageTable < ActiveRecord::Migration[5.0]
  def change
    create_table :images do |t|
      t.string :name, null: false
      t.boolean :primary, null: false, default: false
      t.string :image_src, null: false
      t.string :size
      t.references :imageable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
