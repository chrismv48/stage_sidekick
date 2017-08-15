class ProductionsController < ApplicationController
  before_action :set_production, only: [:show, :update, :destroy, :directory]

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

  def directory
    directory = Role.includes(:user).where(venue_id: @production.venue.id).map do |role|
      user = role.user
      {
        user_id: user.id,
        role_id: role.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        role_type: role.role_type,
        title: role.title,
        department: role.department,
        staff: role.production_id.nil?,
        start_date: role.start_date
      }
    end
    render json: directory
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
