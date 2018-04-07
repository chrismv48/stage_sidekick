require 'pdf-reader'
require 'open-uri'
require 'rtesseract'
require 'active_support/core_ext/string/inflections'
require 'openssl'
require 'pry'

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
      proc: Proc.new {|line| line.split(DELIMITER_REGEX)[0] == line.split(DELIMITER_REGEX)[0].titleize}
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
      self.apply_patterns
    end

    return @matched_patterns_to_lines.select do |matched_patterns, candidates|
      !matched_patterns.includes('begins with Act or Scene') &&
        candidates.values.any? {|count| count >= 15}
    end
  end

  def generate_scene_options
    if @matched_patterns_to_lines.nil?
      self.apply_patterns
    end

    return @matched_patterns_to_lines.select do |matched_patterns, candidates|
      matched_patterns.includes('begins with Act or Scene')
    end
  end

  def generate_script(character_pattern, characters, scene_pattern = nil, scenes = [])

    if @lines_patterns.nil?
      self.apply_patterns
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
        current_character = current_character.titleize if current_character
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
    puts 'done!'
    return script
  end


  private

  def should_skip_line?(line)
    return [
      line.strip.empty?,
      /[a-z]/.match(line.downcase).nil?
    ].any?
  end

  # iterates through the script and applies each pattern to a line building a hash <Set(matched patterns)> : [matched lines]
  def apply_patterns
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
# web_input = 'http://www.kinnarieco-theatre.org/scripts/GreeningofOz_Eng.pdf'
# web_input = 'https://gymkhana.iitb.ac.in/~cultural/dram_scripts/romeo_juliett.pdf'
# pdf_reader = ScriptReader.new(input)
# pdf_reader.apply_patterns
# puts 'foo'
# pdf_reader.process_script(pdf_reader.full_text, /^[\w\s]+:$/, /^(Act .*|Scene .*)$/i)
# pdf_reader.read_ocr(input)
