# == Schema Information
#
# Table name: characters_stage_actions
#
#  id              :integer          not null, primary key
#  stage_action_id :integer          not null
#  character_id    :integer          not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_characters_stage_actions_on_character_id     (character_id)
#  index_characters_stage_actions_on_stage_action_id  (stage_action_id)
#

class CharactersStageAction < ApplicationRecord
  belongs_to :stage_action
  belongs_to :character
end
