class ApplicationController < ActionController::API

  def index
    render json: {greeting: 'Hello world!'}
  end

  def build_json_response(entity, associations)
    serialized = entity.as_json(methods: associations)
    serialized = serialized.kind_of?(Array) ? serialized : [serialized]
    all_ids = []
    by_id = {}
    serialized.each do |object|
      by_id[object['id']] = object
      all_ids.push(object['id'])
    end
    {
      controller_name => {
        byId: by_id,
        allIds: all_ids
      }
    }
  end

  # since we can't use object.association = for images, we have to do a manual implementation
  def reconcile_images(imageable, images)
    current_image_ids = imageable.images.pluck(:id)

    # remove associations
    images_to_remove = current_image_ids - images.pluck(:id)
    imageable.images.where(id: images_to_remove).each do |img_to_remove|
      img_to_remove.update(imageable_id: nil,  imageable_type: nil)
    end
    # create / update
    images.each do |image|
      if current_image_ids.include? image['id']
        Image.find(image['id']).update(image.except(:image_src))
      else
        Image.create(
          name: image['name'],
          imageable: imageable,
          image_src: image['image_src']['url'],
          primary: image['primary'] || false,
          size: image['size']
        )
      end
    end
  end


end
