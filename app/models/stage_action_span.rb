# == Schema Information
#
# Table name: stage_action_spans
#
#  id             :integer          not null, primary key
#  span_start     :integer          not null
#  span_end       :integer
#  description    :string
#  status         :string
#  spannable_id   :integer
#  spannable_type :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_stage_action_spans_on_span_end        (span_end)
#  index_stage_action_spans_on_span_start      (span_start)
#  index_stage_action_spans_on_spannable_id    (spannable_id)
#  index_stage_action_spans_on_spannable_type  (spannable_type)
#

class StageActionSpan < ApplicationRecord
  belongs_to :spannable, polymorphic: true
  accepts_nested_attributes_for :spannable

  scope :by_number, -> (number) { where("span_start <= ? AND (span_end IS NULL OR span_end >= ?)", number, number)}
end
