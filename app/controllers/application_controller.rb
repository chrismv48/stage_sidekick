class ApplicationController < ActionController::API
  def index
    render json: {greeting: 'Hello world!'}
  end
end
