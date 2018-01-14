class LinesController < ApplicationController
  before_action :set_line, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:scene_id, :character_ids]

  # GET /lines
  def index
    @lines = Line.where(nil)
    @lines = @lines.where(production_id: params[:production_id]) if params[:production_id]
    @lines = @lines.order(:number)
    render json: build_json_response(@lines, ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /lines/1
  def show
    render json: build_json_response(@line, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /lines
  def create
    @line = Line.new(@line_params)

    if @line.save
      render json: build_json_response(@line, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @line
    else
      render json: @line.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /lines/1
  def update
    if @line.update(@line_params)
      render json: build_json_response(@line, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @line.errors, status: :unprocessable_entity
    end
  end

  # DELETE /lines/1
  def destroy
    if @line.destroy
      render json: {success: true}
    else
      render json: @line.errors, status: :unprocessable_entity
    end
  end

  private

  def set_line
    @line = Line.find(params[:id])
  end

  def parse_params
    params.permit!
    @line_params = params.slice(*Line.attribute_names, :line_ids, :actor_ids, :scene_ids)
  end
end
