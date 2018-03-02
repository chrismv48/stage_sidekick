class ApplicationController < ActionController::API

  before_action :set_model

  def index
    render json: {greeting: 'Hello world!'}
  end

  def build_json_response(entity, associations)
    serialized = entity.as_json(methods: associations)
    serialized = serialized.kind_of?(Array) ? serialized : [serialized]
    {
      controller_name => serialized
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
        Image.find(image['id']).update(image.except(:image_src, :updated_at, :created_at))
      else
        Image.create(
          name: image['name'],
          imageable: imageable,
          image_src: image['image_src']['url'],
          primary: image['primary'] || false,
          size: image['size'],
          order_index: image['order_index']
        )
      end
    end
  end

  def reconcile_comments(commentable, comments)
    current_ids = commentable.comments.pluck(:id)

    # remove associations
    ids_to_remove = current_ids - comments.pluck(:id)
    commentable.comments.where(id: ids_to_remove).each do |to_remove|
      to_remove.destroy!
    end

    # create / update
    comments.each do |comment|
      if current_ids.include? comment['id']
        Comment.find(comment['id']).update(comment.except(:updated_at, :created_at))
      else
        Comment.create(comment)
      end
    end
  end

  def model_params
    return @model.attribute_names - [:updated_at, :created_at]
  end

  private

  def set_model
    begin
      @model = controller_name.classify.constantize
    rescue NameError
      @model = nil
    end
  end
end
