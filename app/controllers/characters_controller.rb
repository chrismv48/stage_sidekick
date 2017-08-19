class CharactersController < ApplicationController
  before_action :set_character, only: [:show, :update, :destroy]

  # GET /characters
  def index
    @characters = Character.where(nil)
    @characters = @characters.where(production_id: params[:production_id]) if params[:production_id]

    render json: @characters, include: [:roles, :scenes]
  end

  # GET /characters/1
  def show
    render json: @character, include: [:roles, :scenes]
  end

  # POST /characters
  def create
    @character = Character.new(character_params)

    if @character.save
      render json: @character, status: :created, location: @character
    else
      render json: @character.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /characters/1
  def update
    if @character.update(character_params)
      render json: @character
    else
      render json: @character.errors, status: :unprocessable_entity
    end
  end

  # DELETE /characters/1
  def destroy
    @character.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_character
      @character = Character.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def character_params
      params.fetch(:character, {}).permit(:id, :name, :description, scene_ids: [])
    end
end
