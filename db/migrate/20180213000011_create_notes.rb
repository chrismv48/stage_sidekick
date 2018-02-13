class CreateNotes < ActiveRecord::Migration[5.0]
  def change
    create_table :notes do |t|
      t.string :category
      t.string :department
      t.belongs_to :actor, index: true
      t.integer :noteable_id
      t.string :noteable_type
      t.string :note
      t.string :priority
      t.string :status
      t.integer :completed_by
      t.timestamps
    end
  end
end
