# == Schema Information
#
# Table name: characters_roles
#
#  id           :integer          not null, primary key
#  role_id      :integer          not null
#  character_id :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_characters_roles_on_character_id  (character_id)
#  index_characters_roles_on_role_id       (role_id)
#

class CharactersRole < ApplicationRecord
  belongs_to :role
  belongs_to :character
end
