# == Schema Information
#
# Table name: images
#
#  id             :integer          not null, primary key
#  name           :string           not null
#  primary        :boolean          default(FALSE), not null
#  image_src      :string           not null
#  size           :string
#  imageable_type :string
#  imageable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  order_index    :integer
#
# Indexes
#
#  index_images_on_imageable_type_and_imageable_id  (imageable_type,imageable_id)
#

class Image < ApplicationRecord
  mount_base64_uploader :image_src, ImageUploader, file_name: -> (image) {"#{image.imageable_type}_#{image.imageable_id}_#{Time.zone.now.to_i}"}

  belongs_to :imageable, polymorphic: true, optional: true

  after_initialize :init
  before_validation :assign_primary

  before_save :assign_order_index

  def init
    self.name ||= "#{self.imageable_type}_#{self.imageable_id}_#{Time.zone.now.to_i}"
  end

  def assign_order_index
    return unless self.order_index.nil?
    last_image = self.other_images_for_type.order(:order_index).last
    self.order_index = (last_image.try(:order_index) || 1) + 1
  end

  def other_images_for_type
    Image.where(imageable_type: self.imageable_type, imageable_id: self.imageable_id).where.not(id: self.id)
  end

  # since at least one image per imageable needs to be primary, we need to assign it appropriately
  def assign_primary
    if self.imageable
      other_images = self.imageable.images.where.not(id: self.id)
    elsif self.imageable_id_was
      imageable = self.imageable_type_was.constantize
      imageable_model = imageable.find(self.imageable_id_was)
      other_images = imageable_model.images.where.not(id: self.id)
      self.primary = false  # disassociated from imageable, so can't be primary any longer
    else  # image isn't assigned to any reference, so can't assign primary
      return
    end

    if self.primary
      prexisting_primary_image = other_images.find(&:primary)
      if prexisting_primary_image
        prexisting_primary_image.primary = false
        prexisting_primary_image.save!(validate: false)  # prevent infinite loop
      end
    else
      if !other_images.any?(&:primary)
        if self.primary_was
          new_primary_image = other_images.first
          new_primary_image.primary = true
          new_primary_image.save!(validate: false)   # prevent infinite loop
        else
          self.primary = true
        end
      end
    end
  end
end
