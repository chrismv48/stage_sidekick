class CostumeItemsController < ApplicationController
  before_action :set_costume_item, only: [:show, :update, :destroy]

  ASSOCIATIONS_TO_INCLUDE = [:costume]

  # GET /costume_items
  def index
    @costume_items = CostumeItem.all

    render json: build_json_response(@costume_items)
  end

  # GET /costume_items/1
  def show
    render json: build_json_response(@costume_item)
  end

  # POST /costume_items
  def create
    @costume_item = CostumeItem.new(costume_item_params)

    if @costume_item.save
      render json: build_json_response(@costume_item), status: :created, location: @costume_item
    else
      render json: @costume_item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /costume_items/1
  def update
    if @costume_item.update(costume_item_params)
      render json: build_json_response(@costume_item)
    else
      render json: @costume_item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /costume_items/1
  def destroy
    @costume_item.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_costume_item
    @costume_item = CostumeItem.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def costume_item_params
    params.permit(
      :id,
      :costume_id,
      :title,
      :description,
      :item_type,
      :display_image
    )
  end

  def build_json_response(entity)
    {
      resource: 'costume_items',
      relationships: ASSOCIATIONS_TO_INCLUDE,
      result: entity.as_json(include: ASSOCIATIONS_TO_INCLUDE)
    }
  end

end
