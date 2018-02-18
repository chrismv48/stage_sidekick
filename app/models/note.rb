# == Schema Information
#
# Table name: notes
#
#  id                   :integer          not null, primary key
#  category             :string
#  department           :string
#  actor_id             :integer
#  noteable_id          :integer
#  noteable_type        :string
#  description          :string
#  priority             :string
#  status               :string
#  completed_by_role_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  scene_id             :integer
#  title                :string
#
# Indexes
#
#  index_notes_on_actor_id  (actor_id)
#

class Note < ApplicationRecord
  has_many :roles_notes
  has_many :assignees, through: :roles_notes, source: :role
  belongs_to :noteable, polymorphic: true
  belongs_to :actor, optional: true
  belongs_to :scene, optional: true
  belongs_to :completed_by, class_name: 'Role', foreign_key: :completed_by_role_id, optional: true

  def assignee_ids
    return self.assignees.pluck(:id)
  end

end
