require 'script_reader'

class ScriptImporterController < ApplicationController

  def parse_script

    if params[:format] == 'pdf'
      base64_str = params[:payload].split('base64,')[1]
      io = StringIO.new(Base64.decode64(base64_str))
    else
      io = open(params[:payload], {ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE})
    end

    script_reader = ScriptReader.new(io)
    scene_options = script_reader.generate_scene_options
    character_options = script_reader.generate_character_options

    response = {
      scene_options: scene_options,
      character_options: character_options
    }

    render json: response.as_json

  end

  def generate_script
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
