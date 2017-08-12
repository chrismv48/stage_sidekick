class CreateMembers < ActiveRecord::Migration[5.0]
  def change
    create_table :members do |t|
      t.belongs_to :user, index: true, null: false
      t.belongs_to :venue, index:true, null: false
      t.string :title, limit: 50
      t.timestamps
    end
  end
end
