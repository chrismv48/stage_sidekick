# == Schema Information
#
# Table name: characters
#
#  id            :integer          not null, primary key
#  name          :string(50)       not null
#  description   :string(1000)
#  type          :string(20)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  production_id :integer          not null
#  order_index   :integer
#  display_image :string
#

class Character < ApplicationRecord

  mount_base64_uploader :display_image, ImageUploader, file_name: -> (character) { "#{character.name}_#{Time.zone.now.to_i}" }

  has_many :costumes_characters_scenes, dependent: :destroy

  has_many :characters_scenes, dependent: :destroy
  has_many :scenes, through: :characters_scenes

  has_many :characters_costumes, dependent: :destroy
  has_many :costumes, through: :characters_costumes

  has_many :characters_roles, dependent: :destroy
  has_many :roles, through: :characters_roles

  alias_attribute :actors, :roles

  after_create do |character|
    if character.order_index.nil?
      character.order_index = character.id
      character.save!
    end
  end
end
