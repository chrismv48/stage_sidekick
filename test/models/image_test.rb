# == Schema Information
#
# Table name: images
#
#  id             :integer          not null, primary key
#  name           :string           not null
#  primary        :boolean          default(FALSE), not null
#  image_src      :string           not null
#  size           :string
#  imageable_type :string
#  imageable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_images_on_imageable_type_and_imageable_id  (imageable_type,imageable_id)
#

require 'test_helper'

class ImageTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
