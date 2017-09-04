class CharactersController < ApplicationController
  before_action :set_character, only: [:show, :update, :destroy]

  ASSOCIATIONS_TO_INCLUDE = [:roles, :scenes, :characters_scenes]

  # GET /characters
  def index
    @characters = Character.where(nil)
    @characters = @characters.where(production_id: params[:production_id]) if params[:production_id]

    render json: build_json_response(@characters)
  end

  # GET /characters/1
  def show
    render json: build_json_response(@character)
  end

  # POST /characters
  def create
    @character = Character.new(character_params)

    if @character.save
      render json: build_json_response(@character), status: :created, location: @character
    else
      render json: @character.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /characters/1
  def update
    if @character.update(character_params)
      render json: build_json_response(@character), include: [:roles, :scenes]
    else
      render json: @character.errors, status: :unprocessable_entity
    end
  end

  # DELETE /characters/1
  def destroy
    if @character.destroy
      render json: {success: true}
    else
      render json: @character.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_character
      @character = Character.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def character_params
      params.permit(
        :id,
        :name,
        :description,
        :production_id,
        :display_image,
        scene_ids: [],
        role_ids: []
      )
    end

    def build_json_response(entity)
        {
          resource: 'characters',
          relationships: ASSOCIATIONS_TO_INCLUDE,
          result: entity.as_json(include: ASSOCIATIONS_TO_INCLUDE)
        }
    end

end
