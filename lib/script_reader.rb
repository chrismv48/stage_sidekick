require 'pdf-reader'
require 'open-uri'
require 'rtesseract'
require 'active_support/core_ext/string/inflections'
require 'openssl'

class ScriptReader

  attr_reader :reader

  PATTERNS = [
    {
      description: 'all uppercase',
      proc: Proc.new {|line| line.upcase == line}
    },
    {
      description: 'ends with colon',
      proc: Proc.new {|line| line.strip[-1] == ':'}
    },
    # {
    #   description: 'does not end in a sentence delimiter',
    #   proc: Proc.new {|line| !['?', '.', '!', ')'].include? line.strip[-1]}
    # },
    {
      description: 'titlecased',  # not using titleize because there are some edge cases like 'Act II' where we don't want to downcase the rest of the word
      proc: Proc.new {|line| line.split(' ').map {|word| word[0].upcase + word[1..-1]}.join(' ') == line.strip && line.upcase != line}
    },
    {
      description: 'preceded by multiple linebreaks',
      proc: Proc.new {|consecutive_line_break_count| consecutive_line_break_count > 1}
    }
  ]


  def initialize(input)
    io = open(input, {ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE})
    @reader = PDF::Reader.new(io)
  end

  def should_skip_line?(line)
    return [
      line.strip.empty?,
      /[a-z]/.match(line.downcase).nil?
    ].any?
  end


  def apply_patterns
    lines_patterns = []
    line_count = 0
    consecutive_line_break_count = 0
    matched_patterns_to_lines = Hash.new {|h, k| h[k] = {}}
    @reader.pages.each do |page|
      page.text.each_line do |line|
        consecutive_line_break_count += 1 if line == "\n"
        next if should_skip_line?(line)
        line_count += 1
        matched_patterns = Set.new
        PATTERNS.each do |pattern|
          if pattern[:description] == 'preceded by multiple linebreaks'
            matched_patterns.add(pattern[:description]) if pattern[:proc].call(consecutive_line_break_count)
          else
            matched_patterns.add(pattern[:description]) if pattern[:proc].call(line)
          end
        end

        lines_patterns.push({
                              line_number: line_count,
                              line_content: line,
                              patterns: matched_patterns
                            })

        if matched_patterns_to_lines[matched_patterns].has_key?(line)
          matched_patterns_to_lines[matched_patterns][line] += 1
        else
          matched_patterns_to_lines[matched_patterns][line] = 1
        end

        consecutive_line_break_count = 0
      end

    end
    puts 'foo'

  end

  def extract_character_candidates(pattern_set_content_to_lines)

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

# input = '/Users/chrisarmstrong/Projects/stage_sidekick/foo.pdf'
# web_input = 'http://www.kinnarieco-theatre.org/scripts/GreeningofOz_Eng.pdf'
web_input = 'https://gymkhana.iitb.ac.in/~cultural/dram_scripts/romeo_juliett.pdf'
pdf_reader = ScriptReader.new(web_input)
pdf_reader.apply_patterns
puts 'foo'
# pdf_reader.process_script(pdf_reader.full_text, /^[\w\s]+:$/, /^(Act .*|Scene .*)$/i)
# pdf_reader.read_ocr(input)
