class CreateMembersCharacters < ActiveRecord::Migration[5.0]
  def change
    create_table :members_characters do |t|
      t.belongs_to :member, null: false, index: true
      t.belongs_to :character, null: false, index: true
      t.timestamps
    end
  end
end
