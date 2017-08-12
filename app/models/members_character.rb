# == Schema Information
#
# Table name: members_characters
#
#  id           :integer          not null, primary key
#  member_id    :integer          not null
#  character_id :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_members_characters_on_character_id  (character_id)
#  index_members_characters_on_member_id     (member_id)
#

class MembersCharacter < ApplicationRecord
  belongs_to :member
  belongs_to :character
end
