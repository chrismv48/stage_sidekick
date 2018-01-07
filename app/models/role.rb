# == Schema Information
#
# Table name: roles
#
#  id            :integer          not null, primary key
#  user_id       :integer          not null
#  production_id :integer
#  venue_id      :integer          not null
#  title         :string
#  department    :string
#  status        :string
#  start_date    :date
#  end_date      :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  first_name    :string
#  last_name     :string
#  type          :string
#  order_index   :integer
#  description   :string
#
# Indexes
#
#  index_roles_on_production_id  (production_id)
#  index_roles_on_user_id        (user_id)
#  index_roles_on_venue_id       (venue_id)
#

class Role < ApplicationRecord

  belongs_to :user
  belongs_to :production
  belongs_to :venue

  has_many :images, as: :imageable

  scope :actor, -> { where(title: 'Actor') }

  def primary_image(default_to_non_primary = true)
    if default_to_non_primary
      self.images.order(primary: :desc)
    else
      self.images.find_by(primary: true)
    end
  end

end
