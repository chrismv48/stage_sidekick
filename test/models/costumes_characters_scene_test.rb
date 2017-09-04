# == Schema Information
#
# Table name: costumes_characters_scenes
#
#  id                  :integer          not null, primary key
#  costume_id          :integer          not null
#  characters_scene_id :integer
#  character_id        :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_costumes_characters_scenes_on_character_id         (character_id)
#  index_costumes_characters_scenes_on_characters_scene_id  (characters_scene_id)
#  index_costumes_characters_scenes_on_costume_id           (costume_id)
#

require 'test_helper'

class CostumesCharactersSceneTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
