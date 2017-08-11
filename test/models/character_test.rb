# == Schema Information
#
# Table name: characters
#
#  id          :integer          not null, primary key
#  name        :string(50)       not null
#  scene_id    :integer          not null
#  description :string(1000)
#  type        :string(20)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_characters_on_scene_id  (scene_id)
#

require 'test_helper'

class CharacterTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
