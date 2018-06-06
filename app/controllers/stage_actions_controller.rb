class StageActionsController < ApplicationController
  before_action :set_stage_actions
  before_action :set_stage_action, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:index, :create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:scene_id, :character_ids]

  # GET /stage_actions
  def index
    return search_results if @stage_action_params[:query]

    json_response = build_json_response(@stage_actions, ASSOCIATIONS_TO_INCLUDE)
    json_response[:total_count] = StageAction.count
    json_response[:scenes_with_stage_action] = StageAction.order(:number).pluck(:scene_id, :number).uniq {|result| result[0]}
    render json: json_response
  end

  def search_results
    search_results = StageAction.search_by_description(@stage_action_params[:query]).limit(5).with_pg_search_highlight
    json_response = build_json_response(search_results, [:pg_search_highlight, :characters])
    render json: json_response
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
    @stage_actions = StageAction.includes(:characters).where(nil)
    @stage_actions = @stage_actions.where(production_id: params[:production_id]) if params[:production_id]
    if params[:start] && params[:end]
      @stage_actions = @stage_actions.where(number: params[:start].to_i..params[:end].to_i)
    end
    @stage_actions = @stage_actions.order(:number)
  end

  def parse_params
    params.permit!
    @stage_action_params = params.slice(*StageAction.attribute_names, :scene_id, :character_ids, :query)
  end
end
