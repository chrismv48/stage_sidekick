class CreateRolesNotes < ActiveRecord::Migration[5.0]
  def change
    create_table :roles_notes do |t|
      t.belongs_to :role, index: true
      t.belongs_to :note, index: true
      t.timestamps
    end
  end
end
