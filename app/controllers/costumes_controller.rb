class CostumesController < ApplicationController
  before_action :set_costume, only: [:show, :update, :destroy]

  # GET /costumes
  def index
    @costumes = Costume.all

    render json: @costumes
  end

  # GET /costumes/1
  def show
    render json: @costume
  end

  # POST /costumes
  def create
    @costume = Costume.new(costume_params)

    if @costume.save
      render json: @costume, status: :created, location: @costume
    else
      render json: @costume.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /costumes/1
  def update
    if @costume.update(costume_params)
      render json: @costume
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
      params.fetch(:costume, {})
    end
end
