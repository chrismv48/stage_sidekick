# == Schema Information
#
# Table name: costume_items
#
#  id            :integer          not null, primary key
#  costume_id    :integer
#  title         :string
#  description   :string
#  item_type     :string
#  display_image :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_costume_items_on_costume_id  (costume_id)
#

class CostumeItem < ApplicationRecord
  mount_base64_uploader :display_image, ImageUploader, file_name: -> (costumeItem) { "#{costumeItem.title}_#{Time.zone.now.to_i}" }

  belongs_to :costume
end
