class ApplicationController < ActionController::API

  def index
    render json: {greeting: 'Hello world!'}
  end

  def build_json_response(entity, associations)
    serialized = entity.as_json(methods: associations)
    serialized = serialized.kind_of?(Array) ? serialized : [serialized]
    all_ids = []
    by_id = {}
    serialized.each do |object|
      by_id[object['id']] = object
      all_ids.push(object['id'])
    end
    {
      controller_name => {
        byId: by_id,
        allIds: all_ids
      }
    }
  end


end
