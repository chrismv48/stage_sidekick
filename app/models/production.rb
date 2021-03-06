# == Schema Information
#
# Table name: productions
#
#  id         :integer          not null, primary key
#  title      :string(50)       not null
#  venue_id   :integer          not null
#  status     :string(15)
#  start_date :date
#  end_date   :date
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_productions_on_venue_id  (venue_id)
#

class Production < ApplicationRecord
  belongs_to :venue
  has_many :roles

end
