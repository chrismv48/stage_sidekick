class CreateStagePresences < ActiveRecord::Migration[5.0]
  def change
    create_table :stage_presences do |t|
      t.belongs_to :character
      t.string :entrance_location
      t.string :exit_location

      t.timestamps
    end
  end
end
