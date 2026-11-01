Rails.application.routes.draw do
  get "/up", to: "rails/health#show", as: :rails_health_check

  get "/setup", to: "registrations#new", as: :setup
  post "/setup", to: "registrations#create"
  get "/connexion", to: "sessions#new", as: :connexion
  post "/session", to: "sessions#create", as: :session
  delete "/session", to: "sessions#destroy"

  get "/recherche", to: "planner#search", as: :recherche
  patch "/preferences/planning", to: "calendar_preferences#update", as: :calendar_preferences
  resources :planning_tasks, only: [:create, :destroy] do
    post :schedule, on: :member
  end
  resources :time_blocks, except: [:index, :show] do
    post :return_to_inbox, on: :member
    post :reschedule, on: :member
  end
  root "planner#index"
end
