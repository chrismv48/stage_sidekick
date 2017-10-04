# == Schema Information
#
# Table name: costumes
#
#  id            :integer          not null, primary key
#  title         :string(75)       not null
#  description   :string(1000)
#  production_id :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  display_image :string
#
# Indexes
#
#  index_costumes_on_production_id  (production_id)
#

class Costume < ApplicationRecord
  mount_base64_uploader :display_image, ImageUploader, file_name: -> (costume) { "#{costume.title}_#{Time.zone.now.to_i}" }

  has_many :costumes_characters_scenes, dependent: :destroy
  has_many :characters_scenes, through: :costumes_characters_scenes
  has_many :characters, through: :costumes_characters_scenes
  has_many :scenes, through: :characters_scenes

  has_many :costume_items

  # accepts_nested_attributes_for :characters_costumes, allow_destroy: true
end
