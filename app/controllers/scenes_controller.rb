class ScenesController < ApplicationController
  before_action :set_scene, only: [:show, :update, :destroy]

  ASSOCIATIONS_TO_INCLUDE = [:character_ids]

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
      scenes = Scene.where(id: params[:order_index_swap])
      scenes.each_with_index do |scene|
        scene.order_index = params[:order_index_swap].index(scene.id)
        scene.save
      end
      return render json: build_json_response(scenes, ASSOCIATIONS_TO_INCLUDE)
    end

    @scene = Scene.new(scene_params)

    if @scene.save
      render json: build_json_response(@scene, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @scene
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /scenes/1
  def update
    if @scene.update(scene_params)
      render json: build_json_response(@scene, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # DELETE /scenes/1
  def destroy
    @scene.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_scene
      @scene = Scene.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def scene_params
      params.permit(
        :id,
        :production_id,
        :title,
        :description,
        :order_index,
        :length_in_minutes,
        :setting,
        :display_image,
        character_ids: []
      )
    end
end
