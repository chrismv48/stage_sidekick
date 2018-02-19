# == Schema Information
#
# Table name: characters_scenes
#
#  id           :integer          not null, primary key
#  character_id :integer          not null
#  scene_id     :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_characters_scenes_on_character_id  (character_id)
#  index_characters_scenes_on_scene_id      (scene_id)
#

class CharactersScene < ApplicationRecord
  belongs_to :character, touch: true
  belongs_to :scene, touch: true
end
