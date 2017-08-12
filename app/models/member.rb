# == Schema Information
#
# Table name: members
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  venue_id   :integer          not null
#  title      :string(50)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_members_on_user_id   (user_id)
#  index_members_on_venue_id  (venue_id)
#

class Member < ApplicationRecord
  has_many :members_characters
  has_many :characters, through: :members_characters
end
