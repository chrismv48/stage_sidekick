class StageActionSpansController < ApplicationController
  before_action :set_stage_action_spans
  before_action :set_stage_action, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:index, :create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:spannable]

  # GET /stage_action_spans
  def index
    json_response = build_json_response(@stage_action_spans, ASSOCIATIONS_TO_INCLUDE)

    render json: json_response
  end

  # GET /stage_action_spans/1
  def show
    render json: build_json_response(@stage_action_span, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /stage_action_spans
  def create
    @stage_action_span = StageActionSpan.new(@stage_action_params.except("spannable_attributes"))

    # if spannable model doesn't exist yet, create it
    # TODO: there might be a way to use accepts_nested_attributes_for here
    if @stage_action_span.spannable_id.nil?
      spannable_model = Object.const_get(@stage_action_span.spannable_type)
      # spannable = spannable_model.find_or_initialize_by(@stage_action_params["spannable"])
      spannable = spannable_model.new(@stage_action_params["spannable_attributes"])
      spannable.save!
      @stage_action_span.spannable = spannable
    end

    if @stage_action_span.save
      # we return all stage_action_spans because its possible that the save affected other stage_action's stage_action numbers and the UI needs
      # to know if they changed
      render json: build_json_response(@stage_action_spans.reload, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @stage_action_span
    else
      render json: @stage_action_span.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /stage_action_spans/1
  def update
    if @stage_action_span.update(@stage_action_params)
      render json: build_json_response(@stage_action_spans.reload, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @stage_action_span.errors, status: :unprocessable_entity
    end
  end

  # DELETE /stage_action_spans/1
  def destroy
    if @stage_action_span.destroy
      render json: build_json_response(@stage_action_spans.reload, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @stage_action_span.errors, status: :unprocessable_entity
    end
  end

  private

  def set_stage_action
    @stage_action_span = StageActionSpan.find(params[:id])
  end

  def set_stage_action_spans
    @stage_action_spans = StageActionSpan.order(:span_start)
  end

  def parse_params
    params.permit!
    @stage_action_params = params.slice(*StageActionSpan.attribute_names, :spannable)
    @stage_action_params["spannable_attributes"] = @stage_action_params.delete("spannable")
  end
end
