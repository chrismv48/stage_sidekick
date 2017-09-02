class RolesController < ApplicationController
  before_action :set_role, only: [:show, :update, :destroy]

  ASSOCIATIONS_TO_INCLUDE = ['user']

  # GET /roles
  def index
    @roles = Role.all

    render json: build_json_response(@roles)
  end

  # GET /roles/1
  def show
    render json: build_json_response(@role)
  end

  # POST /roles
  def create
    @role = Role.new(role_params)

    # TODO: temporary workaround to get role form working
    @role.venue_id = 1
    @role.user = User.first

    if @role.save
      render json: build_json_response(@role), status: :created, location: @role
    else
      render json: @role.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /roles/1
  def update
    if @role.update(role_params)
      render json: build_json_response(@role)
    else
      render json: @role.errors, status: :unprocessable_entity
    end
  end

  # DELETE /roles/1
  def destroy
    @role.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_role
    @role = Role.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def role_params
    params.permit(
      :id,
      :production_id,
      :user_id,
      :venue_id,
      :title,
      :department,
      :status,
      :role_type,
      :start_date,
      :end_date,
      :first_name,
      :last_name,
      :avatar
    )
  end

  def build_json_response(entity)
    {
      resource: 'roles',
      relationships: ASSOCIATIONS_TO_INCLUDE,
      result: entity.as_json(include: ASSOCIATIONS_TO_INCLUDE)
    }
  end

end
