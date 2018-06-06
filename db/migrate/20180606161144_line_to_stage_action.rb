class LineToStageAction < ActiveRecord::Migration[5.0]
  def change
    create_table :stage_actions do |t|
      t.belongs_to :production, index: true
      t.belongs_to :scene, index: true
      t.integer :number
      t.integer :page_number
      t.string :stage_action_type
      t.string :description
      t.string :status
      t.boolean :is_entrance
      t.boolean :is_exit
      t.string :entrance_exit_location
      t.string :song
      t.timestamps
    end

    rename_table :characters_lines, :characters_stage_actions
    rename_column :characters_stage_actions, :line_id, :stage_action_id

    rename_column :roles, :type, :role_type

    drop_table :lines
  end
end
