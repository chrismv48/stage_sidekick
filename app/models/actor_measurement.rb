# == Schema Information
#
# Table name: actor_measurements
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  gender     :string
#  height     :float
#  weight     :float
#  ethnicity  :string
#  eye_color  :string
#  hair_color :string
#  chest      :float
#  waist      :float
#  hips       :float
#  neck       :float
#  inseam     :float
#  sleeve     :float
#  shoe_size  :float
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_actor_measurements_on_user_id  (user_id)
#

class ActorMeasurement < ApplicationRecord
  belongs_to :user
end
