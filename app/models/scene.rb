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
#
# Indexes
#
#  index_scenes_on_production_id  (production_id)
#

class Scene < ApplicationRecord
  has_many :characters_scenes
  has_many :characters, through: :characters_scenes

end
