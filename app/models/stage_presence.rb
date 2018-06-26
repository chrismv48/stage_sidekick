# == Schema Information
#
# Table name: stage_presences
#
#  id                :integer          not null, primary key
#  character_id      :integer
#  entrance_location :string
#  exit_location     :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_stage_presences_on_character_id  (character_id)
#

class StagePresence < ApplicationRecord

  belongs_to :character
  has_one :stage_action_span, as: :spannable

end
