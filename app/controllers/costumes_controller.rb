class CostumesController < ApplicationController
  before_action :set_costume, only: [:show, :update, :destroy]

  ASSOCIATIONS_TO_INCLUDE = [:character_ids, :scene_ids, :costume_item_ids, :costumes_characters_scenes, :characters_scenes]

  # GET /costumes
  def index
    @costumes = Costume.all

    render json: build_json_response(@costumes, ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /costumes/1
  def show
    render json: build_json_response(@costume, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /costumes
  def create
    @costume = Costume.new(costume_params)

    if @costume.save
      unless costume_params[:grouped_costumes_characters_scenes].nil?
        costumes_characters_scenes = parse_character_scenes(params[:grouped_costumes_characters_scenes])
        @costume.costumes_characters_scenes.create(costumes_characters_scenes)
        render json: build_json_response(@costume, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @costume
      end
    else
      render json: @costume.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /costumes/1
  def update
    if @costume.update(costume_params.except(:grouped_costumes_characters_scenes))
      unless costume_params[:grouped_costumes_characters_scenes].nil?
        costumes_characters_scenes = parse_character_scenes(params[:grouped_costumes_characters_scenes])
        @costume.costumes_characters_scenes.destroy_all
        @costume.costumes_characters_scenes.create(costumes_characters_scenes)
      end
      render json: build_json_response(@costume, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @costume.errors, status: :unprocessable_entity
    end
  end

  # DELETE /costumes/1
  def destroy
    @costume.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_costume
      @costume = Costume.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def costume_params
      costume_params = params.permit(
        :id,
        :title,
        :description,
        :production_id
      )
      costume_params[:grouped_costumes_characters_scenes] = params[:grouped_costumes_characters_scenes]
      return costume_params
    end

  def parse_character_scenes(grouped_costumes_characters_scenes)
    costumes_characters_scenes = []
    grouped_costumes_characters_scenes.each do |character_id, character_scenes|
      if character_scenes.any?
        character_scenes.each do |character_scene_id|
          costumes_characters_scene = {
            costume_id: costume_params[:id],
            character_id: character_id,
            characters_scene_id: character_scene_id
          }
          costumes_characters_scenes.push(costumes_characters_scene)
        end
      else
        characters_costumes_attribute = {
          costume_id: costume_params[:id],
          character_id: character_id
        }
        costumes_characters_scenes.push(characters_costumes_attribute)
      end
    end
    return costumes_characters_scenes
  end
end
