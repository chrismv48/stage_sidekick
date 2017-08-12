class ProductionsController < ApplicationController
  before_action :set_production, only: [:show, :update, :destroy]

  # GET /productions
  def index
    @productions = Production.all

    render json: @productions
  end

  # GET /productions/1
  def show
    render json: @production
  end

  # POST /productions
  def create
    @production = Production.new(production_params)

    if @production.save
      render json: @production, status: :created, location: @production
    else
      render json: @production.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /productions/1
  def update
    if @production.update(production_params)
      render json: @production
    else
      render json: @production.errors, status: :unprocessable_entity
    end
  end

  # DELETE /productions/1
  def destroy
    @production.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_production
      @production = Production.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def production_params
      params.fetch(:production, {})
    end
end
