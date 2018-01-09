class ScenesController < ApplicationController
  before_action :set_scene, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:character_ids, :images]

  # GET /scenes
  def index
    @scenes = Scene.order(:order_index)

    render json: build_json_response(@scenes,  ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /scenes/1
  def show
    render json: build_json_response(@scene, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /scenes
  def create
    if params[:order_index_swap]
      scenes = persist_order_index_swap
      return render json: build_json_response(scenes, ASSOCIATIONS_TO_INCLUDE)
    end

    @scene = Scene.new(@scene_params)

    if @scene.save
      if params[:images]
        reconcile_images(@scene, params[:images])
      end
      render json: build_json_response(@scene, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @scene
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /scenes/1
  def update
    if @scene.update(@scene_params)

      if params[:images]
        reconcile_images(@scene, params[:images])
      end

      render json: build_json_response(@scene, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # DELETE /scenes/1
  def destroy
    if @scene.destroy
      render json: {success: true}
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  private

  def set_scene
    @scene = Scene.find(params[:id])
  end

  def parse_params
    params.permit!
    @scene_params = params.slice(*Scene.attribute_names, :scene_ids)
  end

  def persist_order_index_swap
    scenes = Scene.where(id: params[:order_index_swap])
    scenes.each_with_index do |scene|
      scene.order_index = params[:order_index_swap].index(scene.id)
      scene.save
    end
    return scenes
  end

end
