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
#  role_type     :string
#  start_date    :date
#  end_date      :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  first_name    :string
#  last_name     :string
#  avatar        :string
#  display_image :string
#
# Indexes
#
#  index_roles_on_production_id  (production_id)
#  index_roles_on_user_id        (user_id)
#  index_roles_on_venue_id       (venue_id)
#

class Role < ApplicationRecord
  mount_base64_uploader :display_image, ImageUploader, file_name: -> (role) { "#{role.id}.#{Time.zone.now.to_i}" }
  mount_base64_uploader :avatar, ImageUploader, file_name: -> (role) { "#{role.id}.#{Time.zone.now.to_i}" }

  belongs_to :user
  belongs_to :production
  belongs_to :venue

end
