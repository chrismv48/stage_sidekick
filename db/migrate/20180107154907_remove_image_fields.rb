class RemoveImageFields < ActiveRecord::Migration[5.0]
  def change
    remove_column :roles, :display_image, :string
    remove_column :roles, :avatar, :string
    remove_column :characters, :display_image, :string
    remove_column :scenes, :display_image, :string
    remove_column :costumes, :display_image, :string
    remove_column :costume_items, :display_image, :string
  end
end
