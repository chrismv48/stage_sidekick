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

require 'test_helper'

class StageActionSpanTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
