class NotesController < ApplicationController
  before_action :set_note, only: [:show, :update, :destroy]
  before_action :parse_params, only: [:create, :update]

  ASSOCIATIONS_TO_INCLUDE = [:assignee_ids]

  # GET /notes
  def index
    @notes = Note.all
    render json: build_json_response(@notes, ASSOCIATIONS_TO_INCLUDE)
  end

  # GET /notes/1
  def show
    render json: build_json_response(@note, ASSOCIATIONS_TO_INCLUDE)
  end

  # POST /notes
  def create
    @note = Note.new(@note_params)

    if @note.save
      if params[:images]
        reconcile_images(@note, params[:images])
      end

      render json: build_json_response(@note, ASSOCIATIONS_TO_INCLUDE), status: :created, location: @note
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /notes/1
  def update
    if @note.update(@note_params)

      if params[:images]
        reconcile_images(@note, params[:images])
      end

      render json: build_json_response(@note, ASSOCIATIONS_TO_INCLUDE)
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  # DELETE /notes/1
  def destroy
    if @note.destroy
      render json: {success: true}
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  private

  def set_note
    @note = Note.find(params[:id])
  end

  def parse_params
    params.permit!
    @note_params = params.slice(*Note.attribute_names, :actor_id, :scene_id, :assignee_ids)
  end

  # had to override the default build_json_response method because the noteable association was returning a nested `notes` section
  # for just costume items (no idea why)
  # def build_json_response(entity, associations)
  #   serialized = entity.as_json(include: [
  #     {
  #       noteable: {
  #         except: :notes
  #       }
  #     },
  #     :actor,
  #     :scene,
  #     :assignees
  #   ])
  #   serialized = serialized.kind_of?(Array) ? serialized : [serialized]
  #   {
  #     controller_name => serialized
  #   }
  # end

end
