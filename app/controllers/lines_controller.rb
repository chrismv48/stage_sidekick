class LinesController < ApplicationController
  before_action :set_lines
  before_action :set_line, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:scene, :characters]

  # GET /lines
  def index
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
      # we return all lines because its possible that the save affected other line's line numbers and the UI needs
      # to know if they changed
      render json: build_json_response(@lines.reload, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @line
    else
      render json: @line.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /lines/1
  def update
    if @line.update(@line_params)
      render json: build_json_response(@lines.reload, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @line.errors, status: :unprocessable_entity
    end
  end

  # DELETE /lines/1
  def destroy
    if @line.destroy
      render json: build_json_response(@lines.reload, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @line.errors, status: :unprocessable_entity
    end
  end

  private

  def set_line
    @line = Line.find(params[:id])
  end

  def set_lines
    @lines = Line.where(nil)
    @lines = @lines.where(production_id: params[:production_id]) if params[:production_id]
    @lines = @lines.order(:number)
  end

  def parse_params
    params.permit!
    @line_params = params.slice(*Line.attribute_names, :scene_id, :character_ids)
  end
end
