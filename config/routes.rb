Rails.application.routes.draw do
  get '/setup_alerts', to: 'setup_alerts#index'
  resources :notes
  resources :lines
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
