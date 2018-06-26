class CreateStageActionSpans < ActiveRecord::Migration[5.0]
  def change
    create_table :stage_action_spans do |t|
      t.integer :start, null: false, index: true
      t.integer :end, index: true
      t.string :description
      t.string :status
      t.integer :spannable_id, index: true
      t.string :spannable_type, index: true
      t.timestamps
    end
  end
end
