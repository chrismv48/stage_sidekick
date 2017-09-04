class AddDisplayImageToCostumes < ActiveRecord::Migration[5.0]
  def change
    add_column :costumes, :display_image, :string
  end
end
