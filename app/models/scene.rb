# == Schema Information
#
# Table name: scenes
#
#  id                :integer          not null, primary key
#  title             :string(75)       not null
#  production_id     :integer          not null
#  description       :string(1000)
#  order_index       :integer
#  length_in_minutes :integer
#  setting           :string(30)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  display_image     :string
#
# Indexes
#
#  index_scenes_on_production_id  (production_id)
#

class Scene < ApplicationRecord
  mount_base64_uploader :display_image, ImageUploader, file_name: -> (scene) { "#{scene.title}_#{Time.zone.now.to_i}" }

  has_many :characters_scenes, dependent: :destroy
  has_many :characters, through: :characters_scenes

  after_create do |scene|
    if scene.order_index.nil?
      scene.order_index = scene.id
      scene.save!
    end
  end

end
