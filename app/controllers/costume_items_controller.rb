class CostumeItemsController < ApplicationController
  before_action :set_costume_item, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:costume, :images]

  # GET /costume_items
  def index
    @costume_items = CostumeItem.all

    render json: build_json_response(@costume_items, ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /costume_items/1
  def show
    render json: build_json_response(@costume_item, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /costume_items
  def create
    @costume_item = CostumeItem.new(@costume_item_params)

    if @costume_item.save

      if params[:images]
        reconcile_images(@costume_item, params[:images])
      end

      render json: build_json_response(@costume_item, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @costume_item
    else
      render json: @costume_item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /costume_items/1
  def update
    if @costume_item.update(@costume_item_params)

      if params[:images]
        reconcile_images(@costume_item, params[:images])
      end

      render json: build_json_response(@costume_item, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @costume_item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /costume_items/1
  def destroy
    if @costume_item.destroy
      render json: {success: true}
    else
      render json: @costume_item.errors, status: :unprocessable_entity
    end
  end

  private
  def set_costume_item
    @costume_item = CostumeItem.find(params[:id])
  end

  def parse_params
    params.permit!
    @costume_item_params = params.slice(*CostumeItem.attribute_names, :costume_id)
  end
end
