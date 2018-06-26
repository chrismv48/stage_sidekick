# == Schema Information
#
# Table name: stage_actions
#
#  id                :integer          not null, primary key
#  production_id     :integer
#  number            :integer
#  page_number       :integer
#  stage_action_type :string
#  description       :string
#  status            :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_stage_actions_on_production_id  (production_id)
#

class StageAction < ApplicationRecord
  include PgSearch
  pg_search_scope :search_by_description, against: :description, using: {
    tsearch: {
      prefix: true,
      highlight: {
        MaxFragments: 3,
        MaxWords: 70,
        ShortWord: 1,
      }
    },
  }

  belongs_to :scene, optional: true
  belongs_to :production

  # the has many relationship with characters is necessary because some stage_actions are spoken (sang) in unison.
  has_many :characters_stage_actions
  has_many :characters, through: :characters_stage_actions, dependent: :destroy

  after_validation :update_sort_order
  after_destroy :update_sort_order
  after_validation :update_stage_action_spans, on: :create
  after_destroy :update_stage_action_spans

  VALID_STAGE_ACTION_TYPES = [
    'line',
    'stage_direction'
  ]

  validates :stage_action_type, inclusion: { in: VALID_STAGE_ACTION_TYPES }

  def stage_action_spans
    return StageActionSpan.where("span_start <= ? AND (span_end IS NULL OR span_end >= ?)", self.number, self.number)
  end

  private

  def update_sort_order
    # TODO: does not work for swapping yet

    return unless self.number_was != self.number || self.destroyed? || self.number.nil?
    # if a record was removed, we decrement, otherwise we increment
    offset = self.destroyed? ? -1 : 1
    # records_to_update = StageAction.where('number >= ?', self.number).where.not(id: self.id).order(:number)
    StageAction.where('number >= ?', self.number).where.not(id: self.id).update_all("number = number + #{offset}")
  end

  def update_stage_action_spans
    offset = self.destroyed? ? -1 : 1
    affected_stage_action_span = StageActionSpan.by_number(self.number)
    affected_stage_action_span.update_all("span_end = span_end + #{offset}")

    subsequent_stage_action_spans = StageActionSpan.where('span_start > ?', self.number)
    subsequent_stage_action_spans.update_all("span_start = span_start + #{offset}, span_end = span_end + #{offset}")
  end

end
