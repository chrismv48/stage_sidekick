# == Schema Information
#
# Table name: venues
#
#  id          :integer          not null, primary key
#  name        :string(100)      not null
#  description :string(5000)
#  type        :string(30)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Venue < ApplicationRecord
end
