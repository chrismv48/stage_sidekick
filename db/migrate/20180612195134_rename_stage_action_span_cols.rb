class RenameStageActionSpanCols < ActiveRecord::Migration[5.0]
  def change
    rename_column :stage_action_spans, :start, :span_start
    rename_column :stage_action_spans, :end, :span_end
  end
end
