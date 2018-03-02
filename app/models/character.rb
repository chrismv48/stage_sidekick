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
#

class Character < ApplicationRecord

  has_many :costumes_characters_scenes, dependent: :destroy

  has_many :characters_scenes, dependent: :destroy
  has_many :scenes, through: :characters_scenes

  has_many :costumes, through: :costumes_characters_scenes

  has_many :characters_roles, dependent: :destroy
  has_many :roles, through: :characters_roles

  has_many :images, as: :imageable
  has_many :comments, as: :commentable


  # TODO there's probably a way to just create a relationship with actors directly
  alias_attribute :actors, :roles
  alias_attribute :actor_ids, :role_ids

  after_create do |character|
    if character.order_index.nil?
      character.order_index = character.id
      character.save!
    end
  end

  def primary_image(default_to_non_primary = true)
    if default_to_non_primary
      self.images.order(primary: :desc)
    else
      self.images.find_by(primary: true)
    end
  end

end
