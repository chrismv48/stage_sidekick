# == Schema Information
#
# Table name: roles_notes
#
#  id         :integer          not null, primary key
#  role_id    :integer
#  note_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_roles_notes_on_note_id  (note_id)
#  index_roles_notes_on_role_id  (role_id)
#

class RolesNote < ApplicationRecord
  belongs_to :role, touch: true
  belongs_to :note, touch: true
end
