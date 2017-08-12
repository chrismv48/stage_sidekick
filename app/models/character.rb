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
#

class Character < ApplicationRecord

  has_many :characters_scenes
  has_many :scenes, through: :characters_scenes

  has_many :characters_costumes
  has_many :costumes, through: :characters_costumes

  has_many :members_characters
  has_many :members, as: :actors, through: :members_characters

  alias_attribute :actors, :members
end
