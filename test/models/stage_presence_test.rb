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

require 'test_helper'

class StagePresenceTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
