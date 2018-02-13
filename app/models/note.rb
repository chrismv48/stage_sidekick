# == Schema Information
#
# Table name: notes
#
#  id            :integer          not null, primary key
#  category      :string
#  department    :string
#  actor_id      :integer
#  noteable_id   :integer
#  noteable_type :string
#  note          :string
#  priority      :string
#  status        :string
#  completed_by  :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  scene_id      :integer
#
# Indexes
#
#  index_notes_on_actor_id  (actor_id)
#

class Note < ApplicationRecord
  has_many :roles_notes
  has_many :assignees, through: :roles_notes, source: :role
  belongs_to :noteable, polymorphic: true
  belongs_to :actor
  belongs_to :scene

end
