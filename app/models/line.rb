# == Schema Information
#
# Table name: lines
#
#  id            :integer          not null, primary key
#  production_id :integer          not null
#  scene_id      :integer
#  number        :integer
#  page_number   :integer
#  line_type     :string
#  content       :string
#  status        :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_lines_on_production_id  (production_id)
#  index_lines_on_scene_id       (scene_id)
#

class Line < ApplicationRecord
  belongs_to :scene, touch: true
  belongs_to :production, touch: true

  # the has many relationship with characters is necessary because some lines are spoken (sang) in unison.
  has_many :characters_lines
  has_many :characters, through: :characters_lines

  after_validation :update_sort_order
  after_destroy :update_sort_order

  private

  # Adjust line numbers since user can insert/swap lines etc. Naive implementation for now
  def update_sort_order
    return unless self.number_was != self.number || self.destroyed?
    records_to_update = Line.where('number >= ?', self.number).where.not(id: self.id)
    if self.destroyed?
      line_number = self.number
      records_to_update.find_each do |record|
        record.number = line_number
        record.save!(validate: false) # avoid infinite loop!

        line_number += 1
      end
    else
      line_number = self.number + 1
      records_to_update.find_each do |record|
        record.number = line_number
        record.save!(validate: false) # avoid infinite loop!

        line_number += 1
      end
    end
  end
end
