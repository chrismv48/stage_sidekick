class ActorsController < ApplicationController
  before_action :set_actor, only: [:show, :update, :destroy]

  ASSOCIATIONS_TO_INCLUDE = [:character_ids, :images]

  # GET /actors
  def index
    @actors = Actor.all
    json_response = build_json_response(@actors, ASSOCIATIONS_TO_INCLUDE)
    merged_json_response = merge_in_actor_measurements(json_response)
    render json: merged_json_response
  end

  # GET /actors/1
  def show
    json_response = build_json_response(@actor, ASSOCIATIONS_TO_INCLUDE)
    merged_json_response = merge_in_actor_measurements(json_response)
    render json: merged_json_response
  end

  # POST /actors
  def create
    if params[:order_index_swap]
      actors = Actor.where(id: params[:order_index_swap])
      actors.each_with_index do |actor|
        actor.order_index = params[:order_index_swap].index(actor.id)
        actor.save
      end
      return render json: build_json_response(actors, ASSOCIATIONS_TO_INCLUDE)
    end

    @actor = Actor.new(actor_params)

    @actor.venue_id = 1
    @actor.user = User.first

    if @actor.save
      actor_measurement_params = actor_params.slice(*ActorMeasurement.attribute_names.reject {|attr| attr == "id"})
      if !actor_measurement_params.empty?
        actor_measurements = ActorMeasurement.find_or_initialize_by(user_id: @actor.user_id)
        actor_measurements.attributes = actor_measurement_params
        actor_measurements.user_id = @actor.user_id
        actor_measurements.save!
      end
      json_response = build_json_response(@actor, ASSOCIATIONS_TO_INCLUDE)
      merged_json_response = merge_in_actor_measurements(json_response)
      render json: merged_json_response, status: :created, location: @actor
    else
      render json: @actor.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /actors/1
  def update
    if @actor.update(actor_params.slice(*Actor.attribute_names, :character_ids))
      actor_measurement_params = actor_params.slice(*ActorMeasurement.attribute_names.reject {|attr| attr == "id"})
      if !actor_measurement_params.empty?
        actor_measurements = ActorMeasurement.find_or_initialize_by(user_id: @actor.user_id)
        actor_measurements.attributes = actor_measurement_params
        actor_measurements.user_id = @actor.user_id
        actor_measurements.save!
      end

      if actor_params[:images]
        reconcile_images(actor_params[:images])
      end

      json_response = build_json_response(@actor, ASSOCIATIONS_TO_INCLUDE)
      merged_json_response = merge_in_actor_measurements(json_response)
      render json: merged_json_response, status: :created, location: @actor
    else
      render json: @actor.errors, status: :unprocessable_entity
    end
  end

  # DELETE /actors/1
  def destroy
    if @actor.destroy
      render json: {success: true}
    else
      render json: @actor.errors, status: :unprocessable_entity
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_actor
    @actor = Actor.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def actor_params
    params.permit!
    # :id,
    # :production_id,
    # :user_id,
    # :venue_id,
    # :title,
    # :department,
    # :status,
    # :actor_type,
    # :start_date,
    # :end_date,
    # :first_name,
    # :last_name,
    # :avatar,
    # character_ids: []
  end

  def merge_in_actor_measurements(json_response)
    puts json_response
    json_response['actors'][:byId].values.each do |actor|
      actor_measurement = ActorMeasurement.find_by(user_id: actor['user_id'])
      next unless actor_measurement
      json_response['actors'][:byId][actor['id']] = actor.merge(actor_measurement.attributes.except('updated_at', 'created_at', 'id', 'user_id'))
    end

    return json_response
  end

  # since we can't use object.association = for images, we have to do a manual implementation
  def reconcile_images(images)
    current_image_ids = @actor.images.pluck(:id)

    # remove associations
    images_to_remove = current_image_ids - images.pluck(:id)
    @actor.images.where(id: images_to_remove).each do |img_to_remove|
      img_to_remove.update(imageable_id: nil,  imageable_type: nil)
    end
    # create / update
    images.each do |image|
      if current_image_ids.include? image['id']
        Image.find(image['id']).update(image.except(:image_src))
      else
        Image.create(
          name: image['name'],
          imageable: @actor,
          image_src: image['image_src']['url'],
          primary: image['primary'] || false,
          size: image['size']
        )
      end
    end
  end


end
