Rails.application.routes.draw do
  resources :comments
  get '/setup_alerts', to: 'setup_alerts#index'
  post '/script_importer/parse', to: 'script_importer#parse_script'
  post '/script_importer/generate', to: 'script_importer#generate_script'
  resources :notes
  resources :stage_actions
  resources :actors
  resources :roles
  resources :members
  resources :productions do
    get 'directory', on: :member
    get 'characters', on: :member
  end
  resources :costumes
  resources :costume_items
  resources :users
  resources :scenes
  resources :characters
  resources :venues
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'application#index'
end
