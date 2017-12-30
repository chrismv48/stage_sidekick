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
      render json: build_json_response(@costume, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @costume
    else
      render json: @costume.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /costumes/1
  def update
    if @costume.update(costume_params)
      render json: build_json_response(@costume, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @costume.errors, status: :unprocessable_entity
    end
  end

  # DELETE /costumes/1
  def destroy
    if @costume.destroy
      render json: {success: true}
    else
      render json: @costume.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_costume
      @costume = Costume.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def costume_params
      params.permit!
      costume_params = params.slice(
        :id,
        :title,
        :description,
        :production_id,
        # :display_image,
        :costume_item_ids
      )
      if params[:costumes_characters_scenes]
        costume_params[:costumes_characters_scenes] = params[:costumes_characters_scenes].map {|ccs| CostumesCharactersScene.new(ccs)}
      end
      return costume_params
    end
end
