require 'pdf-reader'
require 'open-uri'
require 'rtesseract'

class ScriptReader

  attr_reader :reader

  CHARACTER_PATTERNS = [
    /^[[:upper:] ]+\W?$/, # all uppercase
    /^[\w\s]+:$/ # ends with colon
  ]

  SCENE_PATTERNS = [
    /^(Act .*|Scene .*)$/i
  ]

  def initialize(input)
    io = open(input)
    @reader = PDF::Reader.new(io)
  end

  def full_text
    output_text = ''
    @reader.pages.each do |page|
      output_text += page.to_s
    end
    return output_text
  end

  def apply_pattern(pattern)
    full_text = self.full_text
    results = full_text.scan(pattern)
    cleaned_results = results.flatten.map(&:strip)
    pattern_count = Hash.new(0).tap { |h| cleaned_results.each { |result| h[result] += 1 } }

    return pattern_count
  end

  def process_script(full_text, character_pattern, scene_pattern)
    results = Hash.new { |h, key| h[key] = {} }

    line_number = 0

    scene = nil
    character = nil

    full_text.each_line do |line|
      if line.match(scene_pattern)
        scene = line.match(scene_pattern)[0]
      elsif line.match(character_pattern)
        character = line.match(character_pattern)[0]
      elsif scene && character
        line_number += 1
        if results[scene][character]
          results[scene][character][line_number] = line
        else
          results[scene][character] = {line_number => line}
        end
      end
    end

    return results
  end

  def read_ocr(filename)
    image = RTesseract.new(filename)
    image.to_s
  end



end

input = '/Users/chrisarmstrong/Projects/stage_sidekick/foo.pdf'
web_input = 'http://www.kinnarieco-theatre.org/scripts/GreeningofOz_Eng.pdf'
pdf_reader = ScriptReader.new(input)
# pdf_reader.process_script(pdf_reader.full_text, /^[\w\s]+:$/, /^(Act .*|Scene .*)$/i)
pdf_reader.read_ocr(input)
