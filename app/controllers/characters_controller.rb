class CharactersController < ApplicationController
  before_action :set_character, only: [:show, :update, :destroy]

  ASSOCIATIONS_TO_INCLUDE = [:role_ids, :scene_ids, :characters_scenes]

  # GET /characters
  def index
    @characters = Character.where(nil)
    @characters = @characters.where(production_id: params[:production_id]) if params[:production_id]
    @characters = @characters.order(:order_index)
    render json: build_json_response(@characters, ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /characters/1
  def show
    render json: build_json_response(@character, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /characters
  def create
    if character_params[:order_index_swap]
      old_index, new_index = character_params[:order_index_swap]
      characterA = Character.find_by(order_index: old_index, production_id: character_params[:production_id])
      characterB = Character.find_by(order_index: new_index, production_id: character_params[:production_id])
      characterA.order_index, characterB.order_index = characterB.order_index, characterA.order_index
      characterA.save!
      characterB.save!
      return render json: build_json_response([characterA, characterB], ASSOCIATIONS_TO_INCLUDE)
    end

    @character = Character.new(character_params)

    if @character.save
      render json: build_json_response(@character, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @character
    else
      render json: @character.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /characters/1
  def update
    if @character.update(character_params)
      render json: build_json_response(@character, ASSOCIATIONS_TO_INCLUDE)
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
        role_ids: [],
        order_index_swap: []
      )
    end

end
