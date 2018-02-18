# == Schema Information
#
# Table name: costume_items
#
#  id                :integer          not null, primary key
#  costume_id        :integer
#  title             :string
#  description       :string
#  item_type         :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  care_instructions :string
#  source            :string
#  brand             :string
#  cost              :float
#  notes             :string
#
# Indexes
#
#  index_costume_items_on_costume_id  (costume_id)
#

class CostumeItem < ApplicationRecord

  belongs_to :costume, touch: true
  has_many :images, as: :imageable
  has_many :notes, as: :noteable

  def primary_image(default_to_non_primary = true)
    if default_to_non_primary
      self.images.order(primary: :desc)
    else
      self.images.find_by(primary: true)
    end
  end

end
