require 'script_reader'

class ScriptImporterController < ApplicationController

  def index
    # input = "/Users/chrisarmstrong/Downloads/Mountaintop Script 12.18.pdf"
    input = "http://www.kinnarieco-theatre.org/scripts/GreeningofOz_Eng.pdf"
    script_reader= ScriptReader.new(input)
    scene_options = script_reader.generate_scene_options
    character_options = script_reader.generate_character_options

    response = {
      scene_options: scene_options,
      character_options: character_options
    }

    render json: response.as_json
  end

  def create
    puts 'foo'
    # TODO: somehow let this persist between requests
    input = "http://www.kinnarieco-theatre.org/scripts/GreeningofOz_Eng.pdf"
    script_reader= ScriptReader.new(input)

    script_reader.generate_script(
                   Set.new(params[:characters][:pattern].split(', ')),
                   params[:characters][:characters],
                   Set.new(params[:scenes][:pattern].split(', ')),
                   params[:scenes][:scenes]
    )


    head :no_content
  end

end
