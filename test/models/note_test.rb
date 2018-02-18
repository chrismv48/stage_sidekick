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

require 'test_helper'

class NoteTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
