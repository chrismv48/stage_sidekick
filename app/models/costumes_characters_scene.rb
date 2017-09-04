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

class CostumesCharactersScene < ApplicationRecord
  belongs_to :costume
  belongs_to :character, optional: :true
  belongs_to :characters_scene, optional: :true

  after_save :populate_character_id

  validate :has_character_or_character_scene?

  def has_character_or_character_scene?
    errors.add(:base, 'Must have either a character_id or characters_scenes_id') if characters_scene_id.blank? && character_id.blank?
  end

  def populate_character_id
    if characters_scene_id.present? && character_id.blank?
      self.character_id = self.characters_scene.character_id
      self.save!
    end
  end

end
