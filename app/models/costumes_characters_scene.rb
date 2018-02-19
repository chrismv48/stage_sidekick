# == Schema Information
#
# Table name: costumes_characters_scenes
#
#  id           :integer          not null, primary key
#  costume_id   :integer          not null
#  scene_id     :integer
#  character_id :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  order_index  :integer
#
# Indexes
#
#  index_costumes_characters_scenes_on_character_id  (character_id)
#  index_costumes_characters_scenes_on_costume_id    (costume_id)
#  index_costumes_characters_scenes_on_scene_id      (scene_id)
#

class CostumesCharactersScene < ApplicationRecord
  belongs_to :costume, touch: true
  belongs_to :character, optional: :true, touch: true
  belongs_to :scene, optional: :true, touch: true

end
