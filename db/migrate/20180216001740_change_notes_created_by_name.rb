class ChangeNotesCreatedByName < ActiveRecord::Migration[5.0]
  def change
    rename_column :notes, :completed_by, :completed_by_role_id
  end
end
