class ActorsController < ApplicationController
  before_action :set_actor, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:character_ids, :images]

  # GET /actors
  def index
    @actors = Actor.all
    render json: build_actor_response(@actors)
  end

  # GET /actors/1
  def show
    render json: build_actor_response(@actor)
  end

  # POST /actors
  def create
    if params[:order_index_swap]
      actors = persist_order_index_swap
      return render json: build_actor_response(actors)
    end

    @actor = Actor.new(@actor_params)

    @actor.venue_id = 1
    @actor.user = User.first

    if @actor.save
      if !@measurement_params.empty?
        persist_actor_measurements
      end

      if params[:images]
        reconcile_images(@actor, params[:images])
      end

      render json: build_actor_response(@actor), status: :created, location: @actor
    else
      render json: @actor.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /actors/1
  def update
    if @actor.update(@actor_params)
      if !@measurement_params.empty?
        persist_actor_measurements
      end

      if params[:images]
        reconcile_images(@actor, params[:images])
      end

      render json: build_actor_response(@actor), status: :created, location: @actor
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
  def set_actor
    @actor = Actor.find(params[:id])
  end

  def parse_params
    params.permit!
    @actor_params = params.slice(*Actor.attribute_names, :character_ids)
    @measurement_params = params.slice(*ActorMeasurement.attribute_names.reject {|attr| attr == "id"})
  end

  def merge_in_actor_measurements(json_response)
    puts json_response
    json_response['actors'].each_with_index do |actor, i|
      actor_measurement = ActorMeasurement.find_by(user_id: actor['user_id'])
      next unless actor_measurement
      json_response['actors'][i] = actor.merge(actor_measurement.attributes.except('updated_at', 'created_at', 'id', 'user_id'))
    end

    return json_response
  end

  def build_actor_response(entity)
    json_response = build_json_response(entity, ASSOCIATIONS_TO_INCLUDE)
    return merge_in_actor_measurements(json_response)
  end

  def persist_actor_measurements
    actor_measurements = ActorMeasurement.find_or_initialize_by(user_id: @actor.user_id)
    actor_measurements.attributes = @measurement_params
    actor_measurements.user_id = @actor.user_id
    actor_measurements.save!
  end

  def persist_order_index_swap
    actors = Actor.where(id: params[:order_index_swap])
    actors.each_with_index do |actor|
      actor.order_index = params[:order_index_swap].index(actor.id)
      actor.save
    end
    return actors
  end

end
