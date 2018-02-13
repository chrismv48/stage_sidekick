class AddScenesToNotes < ActiveRecord::Migration[5.0]
  def change
    add_column :notes, :scene_id, :integer
  end
end
