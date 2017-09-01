class ScenesController < ApplicationController
  before_action :set_scene, only: [:show, :update, :destroy]

  ASSOCIATIONS_TO_INCLUDE = [:characters]

  # GET /scenes
  def index
    @scenes = Scene.all

    render json: build_json_response(@scenes)
  end

  # GET /scenes/1
  def show
    render json: build_json_response(@scene)
  end

  # POST /scenes
  def create
    @scene = Scene.new(scene_params)

    if @scene.save
      render json: build_json_response(@scene), status: :created, location: @scene
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /scenes/1
  def update
    if @scene.update(scene_params)
      render json: build_json_response(@scene)
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

    def build_json_response(entity)
      {
        resource: 'scenes',
        relationships: ASSOCIATIONS_TO_INCLUDE,
        result: entity.as_json(include: ASSOCIATIONS_TO_INCLUDE)
      }

    end
end
