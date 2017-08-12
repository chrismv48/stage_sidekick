# == Schema Information
#
# Table name: characters_costumes
#
#  id           :integer          not null, primary key
#  character_id :integer          not null
#  costume_id   :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_characters_costumes_on_character_id  (character_id)
#  index_characters_costumes_on_costume_id    (costume_id)
#

require 'test_helper'

class CharactersCostumeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
