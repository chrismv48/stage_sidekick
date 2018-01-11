# == Schema Information
#
# Table name: lines
#
#  id            :integer          not null, primary key
#  production_id :integer          not null
#  scene_id      :integer
#  number        :integer
#  page_number   :integer
#  line_type     :string
#  content       :string
#  status        :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_lines_on_production_id  (production_id)
#  index_lines_on_scene_id       (scene_id)
#

class Line < ApplicationRecord
  belongs_to :scene
  belongs_to :production

  # the has many relationship with characters is necessary because some lines are spoken (sang) in unison.
  has_many :characters_lines
  has_many :characters, through: :characters_lines
end
