# == Schema Information
#
# Table name: character_costumes
#
#  id           :integer          not null, primary key
#  costume_id   :integer          not null
#  character_id :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  order_index  :integer
#
# Indexes
#
#  index_character_costumes_on_character_id  (character_id)
#  index_character_costumes_on_costume_id    (costume_id)
#

class CharacterCostume < ApplicationRecord
  belongs_to :costume
  belongs_to :character, optional: :true
end
