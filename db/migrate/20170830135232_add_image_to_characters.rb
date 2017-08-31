class AddImageToCharacters < ActiveRecord::Migration[5.0]
  def change
    add_column :characters, :display_image, :string
  end
end
