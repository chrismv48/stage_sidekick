require 'script_reader'
require 'pry'

class ScriptImporterController < ApplicationController

  before_action :get_script_reader, only: [:parse_script, :generate_script]

  def parse_script

    scene_options = @script_reader.generate_scene_options
    character_options = @script_reader.generate_character_options

    response = {
      scene_options: scene_options,
      character_options: character_options
    }

    render json: response.as_json

  end

  def generate_script
    selections = params[:selections]
    @script_reader.generate_script(
                   Set.new(selections[:characters][:pattern].split(', ')),
                   selections[:characters][:characters],
                   Set.new(((selections[:scenes][:pattern] || '').split(', '))),
                   selections[:scenes][:scenes]
    )


    render json: {
      characterCount: @script_reader.characters.size,
      sceneCount: @script_reader.scenes.size,
      lineCount: @script_reader.line_count,
    }
  end

  private

  def get_script_reader
    if params[:format] == 'pdf'
      base64_str = params[:payload].split('base64,')[1];
      io = StringIO.new(Base64.decode64(base64_str));
    else
      io = open(params[:payload], {ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE})
    end

    @script_reader = ScriptReader.new(io)
  end

end
