# == Schema Information
#
# Table name: stage_actions
#
#  id                     :integer          not null, primary key
#  production_id          :integer          not null
#  scene_id               :integer
#  number                 :integer
#  page_number            :integer
#  stage_action_type      :string
#  description            :string
#  status                 :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  is_entrance            :boolean
#  is_exit                :boolean
#  entrance_exit_location :string
#  song                   :string
#
# Indexes
#
#  index_stage_actions_on_production_id  (production_id)
#  index_stage_actions_on_scene_id       (scene_id)
#

class StageAction < ApplicationRecord
  belongs_to :scene, optional: true
  belongs_to :production

  # the has many relationship with characters is necessary because some lines are spoken (sang) in unison.
  has_many :characters_stage_actions
  has_many :characters, through: :characters_stage_actions, dependent: :destroy

  after_validation :update_sort_order
  after_destroy :update_sort_order

  # TODO: add some kind of validation to ensure lines do not belong to characters/scene combos that don't exist

  private

  # Adjust line numbers since user can insert/swap lines etc. Naive implementation for now
  def update_sort_order
    return unless self.number_was != self.number || self.destroyed? || self.number.nil?
    records_to_update = Line.where('number >= ?', self.number).where.not(id: self.id).order(:number)
    if self.destroyed?
      line_number = self.number
      records_to_update.each do |record|
        record.number = line_number
        record.save!(validate: false) # avoid infinite loop!

        line_number += 1
      end
    else
      line_number = self.number + 1
      records_to_update.each do |record|
        record.number = line_number
        record.save!(validate: false) # avoid infinite loop!

        line_number += 1
      end
    end
  end
end
