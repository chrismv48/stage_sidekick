class ChangeNotesFields < ActiveRecord::Migration[5.0]
  def change
    add_column :notes, :title, :string
    rename_column :notes, :note, :description
  end
end
