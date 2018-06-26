class CostumesController < ApplicationController
  before_action :set_costume, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [
    :character_ids,
    :scene_ids,
    :costume_item_ids,
    :note_ids,
    :comments,
    :images
  ]

  # GET /costumes
  def index
    @costumes = Costume.includes(:costume_items, :notes, :comments, :images).all
    render json: build_json_response(@costumes, ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /costumes/1
  def show
    render json: build_json_response(@costume, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /costumes
  def create
    @costume = Costume.new(@costume_params)

    if @costume.save

      if params[:images]
        reconcile_images(@costume, params[:images])
      end

      if params[:comments]
        reconcile_comments(@costume, params[:comments])
      end

      render json: build_json_response(@costume, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @costume
    else
      render json: @costume.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /costumes/1
  def update
    if @costume.update(@costume_params)

      if params[:images]
        reconcile_images(@costume, params[:images])
      end

      if params[:comments]
        reconcile_comments(@costume, params[:comments])
      end

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
    def set_costume
      @costume = Costume.find(params[:id])
    end

    def parse_params
      params.permit!
      @costume_params = params.slice(*model_params, :character_ids, :scene_ids, :costume_item_ids)

      # if params[:costumes_characters_scenes]
      #   @costume_params[:costumes_characters_scenes] = params[:costumes_characters_scenes].map {|ccs| CostumesCharactersScene.new(ccs.except(:id))}
      # end
    end
end
