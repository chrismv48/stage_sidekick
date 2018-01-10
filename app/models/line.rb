# == Schema Information
#
# Table name: lines
#
#  id          :integer          not null, primary key
#  scene_id    :integer
#  number      :integer
#  page_number :integer
#  status      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_lines_on_scene_id  (scene_id)
#

class Line < ApplicationRecord
  belongs_to :scene

  # the has many relationship with characters is necessary because some lines are spoken (sang) in unison.
  has_many :characters_lines
  has_many :characters, through: :characters_lines
end
