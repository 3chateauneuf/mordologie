Rails.application.routes.draw do
  get "/up", to: "rails/health#show", as: :rails_health_check

  get "/setup", to: "registrations#new", as: :setup
  post "/setup", to: "registrations#create"
  get "/connexion", to: "sessions#new", as: :connexion
  post "/session", to: "sessions#create", as: :session
  delete "/session", to: "sessions#destroy"

  resources :time_blocks, except: [:index, :show]
  root "planner#index"
end
