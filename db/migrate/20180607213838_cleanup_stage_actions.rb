class CleanupStageActions < ActiveRecord::Migration[5.0]
  def change
    remove_column :stage_actions, :song
    remove_column :stage_actions, :is_exit
    remove_column :stage_actions, :is_entrance
    remove_column :stage_actions, :entrance_exit_location
    remove_column :stage_actions, :scene_id
  end
end
