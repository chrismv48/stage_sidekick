# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  content          :string
#  role_id          :integer
#  commentable_type :string
#  commentable_id   :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_comments_on_commentable_type_and_commentable_id  (commentable_type,commentable_id)
#

class Comment < ApplicationRecord

  belongs_to :commentable, polymorphic: true
  belongs_to :role

end
