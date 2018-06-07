# == Schema Information
#
# Table name: stage_actions
#
#  id                     :integer          not null, primary key
#  production_id          :integer
#  scene_id               :integer
#  number                 :integer
#  page_number            :integer
#  stage_action_type      :string
#  description            :string
#  status                 :string
#  is_entrance            :boolean
#  is_exit                :boolean
#  entrance_exit_location :string
#  song                   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_stage_actions_on_production_id  (production_id)
#  index_stage_actions_on_scene_id       (scene_id)
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

  # TODO: add some kind of validation to ensure stage_actions do not belong to characters/scene combos that don't exist

  private

  def update_sort_order
    # TODO: does not work for swapping yet

    return unless self.number_was != self.number || self.destroyed? || self.number.nil?
    # if a record was removed, we decrement, otherwise we increment
    offset = self.destroyed? ? -1 : 1
    # records_to_update = StageAction.where('number >= ?', self.number).where.not(id: self.id).order(:number)
    StageAction.where('number >= ?', self.number).where.not(id: self.id).update_all("number = number + #{offset}")
  end

end
