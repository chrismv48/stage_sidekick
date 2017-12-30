class CreateActorMeasurements < ActiveRecord::Migration[5.0]
  def change
    create_table :actor_measurements do |t|
      t.belongs_to :user, index: true, null: false, unique: true
      t.string :gender
      t.float :height
      t.float :weight
      t.string :ethnicity
      t.string :eye_color
      t.string :hair_color
      t.float :chest
      t.float :waist
      t.float :hips
      t.float :neck
      t.float :inseam
      t.float :sleeve
      t.float :shoe_size
      t.timestamps
    end
  end
end
