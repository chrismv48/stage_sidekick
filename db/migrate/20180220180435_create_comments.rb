class CreateComments < ActiveRecord::Migration[5.0]
  def change
    create_table :comments do |t|
      t.string :content
      t.integer :role_id
      t.references :commentable, polymorphic: true, index: true
      t.timestamps
    end
  end
end
