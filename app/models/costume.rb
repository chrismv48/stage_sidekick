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

class Costume < ApplicationRecord

  has_many :costume_items
  has_many :images, as: :imageable

  has_many :notes, as: :noteable
  has_many :comments, as: :commentable


  def primary_image(default_to_non_primary = true)
    if default_to_non_primary
      self.images.order(primary: :desc)
    else
      self.images.find_by(primary: true)
    end
  end

end
