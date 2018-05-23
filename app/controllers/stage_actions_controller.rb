class StageActionsController < ApplicationController
  before_action :set_stage_actions
  before_action :set_stage_action, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:scene_id, :character_ids]

  # GET /stage_actions
  def index
    render json: build_json_response(@stage_actions, ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /stage_actions/1
  def show
    render json: build_json_response(@stage_action, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /stage_actions
  def create
    @stage_action = StageAction.new(@stage_action_params)

    if @stage_action.save
      # we return all stage_actions because its possible that the save affected other stage_action's stage_action numbers and the UI needs
      # to know if they changed
      render json: build_json_response(@stage_actions.reload, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @stage_action
    else
      render json: @stage_action.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /stage_actions/1
  def update
    if @stage_action.update(@stage_action_params)
      render json: build_json_response(@stage_actions.reload, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @stage_action.errors, status: :unprocessable_entity
    end
  end

  # DELETE /stage_actions/1
  def destroy
    if @stage_action.destroy
      render json: build_json_response(@stage_actions.reload, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @stage_action.errors, status: :unprocessable_entity
    end
  end

  private

  def set_stage_action
    @stage_action = StageAction.find(params[:id])
  end

  def set_stage_actions
    @stage_actions = StageAction.where(nil)
    @stage_actions = @stage_actions.where(production_id: params[:production_id]) if params[:production_id]
    @stage_actions = @stage_actions.order(:number)
  end

  def parse_params
    params.permit!
    @stage_action_params = params.slice(*StageAction.attribute_names, :scene_id, :character_ids)
  end
end
