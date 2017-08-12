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

  has_many :characters_roles
  has_many :roles, through: :characters_roles

  alias_attribute :actors, :roles
end
