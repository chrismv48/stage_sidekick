Rails.application.routes.draw do
  resources :members
  resources :productions
  resources :costumes
  resources :users
  resources :scenes
  resources :characters
  resources :venues
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # root 'application#index'
end
