# == Schema Information
#
# Table name: characters_lines
#
#  id           :integer          not null, primary key
#  line_id      :integer          not null
#  character_id :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_characters_lines_on_character_id  (character_id)
#  index_characters_lines_on_line_id       (line_id)
#

require 'test_helper'

class CharactersLineTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
