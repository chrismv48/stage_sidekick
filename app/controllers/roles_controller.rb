class RolesController < ApplicationController
  before_action :set_role, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:user, :assigned_note_ids, :completed_note_ids, :images]

  # GET /roles
  def index
    @roles = Role.all

    render json: build_json_response(@roles, ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /roles/1
  def show
    render json: build_json_response(@role, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /roles
  def create
    @role = Role.new(@role_params)

    # TODO: temporary workaround to get role form working
    @role.venue_id = 1
    @role.user = User.first

    if @role.save
      render json: build_json_response(@role, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @role
    else
      render json: @role.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /roles/1
  def update
    if @role.update(@role_params)
      render json: build_json_response(@role, ASSOCIATIONS_TO_INCLUDE)
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

  def parse_params
    params.permit!
    @role_params = params.slice(*Role.attribute_names)
  end

end
