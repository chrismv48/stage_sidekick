class AddImageToScenes < ActiveRecord::Migration[5.0]
  def change
    add_column :scenes, :display_image, :string
  end
end
