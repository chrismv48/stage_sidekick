class ScenesController < ApplicationController
  before_action :set_scene, only: [:show, :update, :destroy]

  # GET /scenes
  def index
    @scenes = Scene.all

    render json: @scenes, include: :characters
  end

  # GET /scenes/1
  def show
    render json: @scene
  end

  # POST /scenes
  def create
    @scene = Scene.new(scene_params)

    if @scene.save
      render json: @scene, status: :created, location: @scene
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /scenes/1
  def update
    if @scene.update(scene_params)
      render json: @scene
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # DELETE /scenes/1
  def destroy
    @scene.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_scene
      @scene = Scene.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def scene_params
      params.require(:scene).permit(:member, :production, :user, :venue)
    end
end
