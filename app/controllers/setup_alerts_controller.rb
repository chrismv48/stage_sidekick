class SetupAlertsController < ApplicationController

  def index
    alerts = [
      {
        alert: 'scenes_without_characters',
        results: Scene.where.not(id: CharactersScene.select(:scene_id)),
        total_count: Scene.count
      },
      {
        alert: 'characters_without_scenes',
        results: Character.where.not(id: CharactersScene.select(:character_id)),
        total_count: Character.count
      },
      {
        alert: 'character_scenes_without_costumes',
        results: CharactersScene.where.not(scene_id: CostumesCharactersScene.select(:scene_id), character_id: CostumesCharactersScene.select(:character_id)),
        total_count: CharactersScene.count
      },
      {
        alert: 'costumes_without_character_scenes',
        results: Costume.where.not(id: CostumesCharactersScene.select(:costume_id)),
        total_count: Costume.count
      },
      {
        alert: 'costumes_without_costume_items',
        results: Costume.where.not(id: CostumeItem.select(:costume_id)),
        total_count: Costume.count
      },
      {
        alert: 'costume_items_without_costumes',
        results: CostumeItem.where(costume_id: nil),
        total_count: CostumeItem.count
      },
    ]

    render json: alerts.select {|alert| alert[:results].any?}.as_json

  end
end
