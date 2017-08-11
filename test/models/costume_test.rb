# == Schema Information
#
# Table name: costumes
#
#  id            :integer          not null, primary key
#  title         :string(75)       not null
#  description   :string(1000)
#  production_id :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_costumes_on_production_id  (production_id)
#

require 'test_helper'

class CostumeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
