# == Schema Information
#
# Table name: characters
#
#  id            :integer          not null, primary key
#  name          :string(50)       not null
#  description   :string(1000)
#  type          :string(20)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  production_id :integer          not null
#  order_index   :integer
#  display_image :string
#

require 'test_helper'

class CharacterTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
