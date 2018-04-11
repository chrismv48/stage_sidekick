require 'pdf-reader'
require 'open-uri'
require 'rtesseract'
require 'active_support/core_ext/string/inflections'
require 'openssl'
require 'pry'
require 'digest/sha1'
require './config/environment.rb'

ActiveRecord::Base.logger = Logger.new(STDOUT)

class ScriptReader

  attr_reader :reader

  DELIMITER_REGEX = /(\.\s{2,}|\s{2,}|\:|\n)/

  PATTERNS = [
    {
      description: 'all uppercase',
      proc: Proc.new {|line| line.split(DELIMITER_REGEX)[0] == line.split(DELIMITER_REGEX)[0].upcase}
    },
    {
      description: 'ends with delimeter',
      proc: Proc.new {|line| line.split(DELIMITER_REGEX).size >= 3}
    },
    {
      description: 'titlecased', # not using titleize because there are some edge cases like 'Act II' where we don't want to downcase the rest of the word
      proc: Proc.new {|line| line.split(DELIMITER_REGEX)[0].split(' ').map {|word| word[0].upcase + word[1..-1]}.join(' ') == line.strip && line.upcase != line}
    },
    {
      description: 'preceded by multiple linebreaks',
      proc: Proc.new {|consecutive_line_break_count| consecutive_line_break_count >= 1}
    },
    {
      description: 'begins with Act or Scene',
      proc: Proc.new {|line| line.strip.match(/^act |scene /i)}
    }
  ]


  def initialize(input)
    io = open(input, {ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE})
    @reader = PDF::Reader.new(io)
  end

  def generate_character_options

    if @matched_patterns_to_lines.nil?
      apply_patterns
    end

    character_options = @matched_patterns_to_lines.select do |matched_patterns, candidates|
      !matched_patterns.include?('begins with Act or Scene') &&
        candidates.values.any? {|count| count >= 15}
    end.map {|k, v| [k.to_a.join(', '), v.sort_by {|_, val| val}.reverse.to_h]}.to_h

    return character_options
  end

  def generate_scene_options

    if @matched_patterns_to_lines.nil?
      apply_patterns
    end

    scene_options = @matched_patterns_to_lines.select do |matched_patterns, candidates|
      matched_patterns.include?('begins with Act or Scene')
    end.map {|k, v| [k.to_a.join(', '), v.sort_by {|_, val| val}.reverse.to_h]}.to_h

    return scene_options
  end

  def generate_script(character_pattern, characters, scene_pattern = nil, scenes = [], persist: true)

    if @lines_patterns.nil?
      apply_patterns
    end

    prev_character = nil
    current_character = nil

    current_scene = nil

    script = []
    line_number = 1
    script_has_scenes = !scene_pattern.nil?

    @lines_patterns.each do |line|

      if script_has_scenes
        if line[:patterns] >= scene_pattern
          current_scene = find_character_or_scene(line[:line_content], scenes)
          current_character = nil
        end

        next unless current_scene
      end

      if line[:patterns] >= character_pattern
        current_character = find_character_or_scene(line[:line_content], characters)
        current_character = current_character if current_character
      end

      cleaned_line_content = remove_character_and_scene_from_line(line[:line_content], current_character, current_scene)

      next if cleaned_line_content.empty?

      if (prev_character == current_character) && script.any?
        script.last[:line] += cleaned_line_content == "\n" ? cleaned_line_content : " #{cleaned_line_content}"
      else
        script.last[:line].strip! if script.any? # strip the last line before starting a new one

        # start new line
        script_line = {}
        script_line[:number] = line_number
        script_line[:line] = cleaned_line_content
        script_line[:scene] = current_scene
        script_line[:character] = current_character

        script.push(script_line)

        line_number += 1
      end
      prev_character = current_character
    end

    if persist
      ActiveRecord::Base.transaction do
        puts "Persisting script"
        Character.destroy_all
        Scene.destroy_all
        Line.skip_callback(:destroy, :after, :update_sort_order)
        Line.skip_callback(:validation, :after, :update_sort_order)
        Line.destroy_all
        puts "Creating characters"
        characters.each do |character|
          Character.create!(name: character, production_id: 1)
        end

        puts "Creating scenes"
        scenes.each do |scene|
          Scene.create!(title: scene, production_id: 1)
        end

        script.group_by {|x| x[:character]}.each do |character, lines|
          puts "Processing lines for #{character}"
          character_scenes = lines.map {|line| line[:scene]}.uniq.compact
          character_model = Character.find_by(name: character)
          scenes = Scene.where(title: character_scenes)
          character_model.scenes = scenes if character_model
          lines.each do |line|
            Line.create!(
              scene: scenes.find {|scene| scene.title == line[:scene]},
              characters: [character_model].compact,
              number: line[:number],
              content: line[:line],
              production_id: 1
            )
          end
        end
        Line.set_callback(:destroy, :after, :update_sort_order)
        Line.set_callback(:validation, :after, :update_sort_order)
      end
    end
    return script
  end


  private

  def full_text
    full_text = ''

    @reader.pages.each do |page|
      full_text += page.text
    end

    return full_text
  end

  def digest
    @digest ||= Digest::SHA1.hexdigest(full_text)
    return @digest
  end

  def should_skip_line?(line)
    return [
      line.strip.empty?,
      /[a-z]/.match(line.downcase).nil?
    ].any?
  end

  # iterates through the script and applies each pattern to a line building a hash <Set(matched patterns)> : [matched lines]
  def apply_patterns

    cached_result = Rails.cache.read(digest)
    if cached_result
      @lines_patterns = cached_result[:lines_patterns]
      @matched_patterns_to_lines = cached_result[:matched_patterns_to_lines]
      return
    end

    @lines_patterns = []
    line_count = 0
    consecutive_line_break_count = 0
    @matched_patterns_to_lines = Hash.new {|h, k| h[k] = {}}
    @reader.pages.each do |page|
      page.text.each_line do |line|
        # consecutive_line_break_count += 1 if line == "\n"
        # next if should_skip_line?(line)

        line_count += 1
        matched_patterns = Set.new
        PATTERNS.each do |pattern|
          if pattern[:description] == 'preceded by multiple linebreaks'
            matched_patterns.add(pattern[:description]) if pattern[:proc].call(consecutive_line_break_count)
          else
            matched_patterns.add(pattern[:description]) if pattern[:proc].call(line)
          end
        end

        @lines_patterns.push({
                              line_number: line_count,
                              line_content: line,
                              patterns: matched_patterns
                            })

        consecutive_line_break_count = 0

        next if matched_patterns.empty?

        matched_content = line.split(DELIMITER_REGEX)[0].strip
        next if matched_content.empty? or matched_content.size > 25

        if @matched_patterns_to_lines[matched_patterns].has_key?(matched_content)
          @matched_patterns_to_lines[matched_patterns][matched_content] += 1
        else
          @matched_patterns_to_lines[matched_patterns][matched_content] = 1
        end

      end
    end
    Rails.cache.write(digest, {lines_patterns: @lines_patterns, matched_patterns_to_lines: @matched_patterns_to_lines})
  end


  def find_character_or_scene(line, characters_or_scenes)
    characters_or_scenes.sort {|x, y| y.size <=> x.size}.each do |character_or_scene|
      return character_or_scene if line.strip.match(/^#{character_or_scene}/i)
    end
    return nil
  end

  def remove_character_and_scene_from_line(line, character, scene)
    clean_line = line == "\n" ? "\n" : line.strip
    if character
      clean_line.slice!(/^#{character}|#{scene}/i) # remove leading character reference
    else
      clean_line.slice!(/^#{scene}/i) # remove leading scene references
    end
    clean_line.slice!(/^[\.:\- ]*/) # remove leading non-word / whitespace characters
    return clean_line
  end

  def read_ocr(filename)
    image = RTesseract.new(filename)
    image.to_s
  end
end

# input = "/Users/chrisarmstrong/Downloads/Mountaintop Script 12.18.pdf"
# input = "/Users/chrisarmstrong/Downloads/Mountaintop Script 12.18.pdf"
web_input = 'http://www.kinnarieco-theatre.org/scripts/GreeningofOz_Eng.pdf'
# web_input = 'https://gymkhana.iitb.ac.in/~cultural/dram_scripts/romeo_juliett.pdf'

characters = ["DOROTHY",
              "SCARECROW",
              "TIN MAN",
              "LION",
              "GLINDA",
              "WITCH",
              "WIZARD",
              "AUNT EM",
              "OZ'S VOICE",
              "UNCLE HENRY",
              "TOTO",
              "GULCH",
              "DOORMAN",
              "GUARD",
              "WINKIE LEADER",
              "TREE",
              "WINKIE 4",
              "WINKIE 2",
              "WINKIE 1",
              "WINKIE 5",
              "WINKIE 3",
              "MUNCHKIN 2",
              "MUNCHKIN 1",
              "MUNCHKINS",
              "WITCH’S VOICE",
              "MUNCHIKIN 3"]
character_pattern = Set.new(["all uppercase", "ends with delimeter"])
scenes = ["Act V",
          "Act IV",
          "Act III",
          "Act II",
          "Act I"]
scene_pattern = Set.new(["titlecased", "begins with Act or Scene"])
pdf_reader = ScriptReader.new(web_input)
pdf_reader.generate_script(
  character_pattern,
  characters,
  scene_pattern,
  scenes
)
