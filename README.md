# Planner (Rails)

Nouvelle application de planification hebdomadaire, issue du projet Mordologie. Interface en français.

## État
Première version: connexion privée, installation initiale protégée par code, agenda hebdomadaire, création/modification/suppression de créneaux, temps prévu et temps réellement déclaré.

Ne comprend **pas encore**: import des données Mordologie, minuteur, liaison OAuth Google Calendar, édition par glisser-déposer.

## Déploiement Railway
Le projet Railway existant dispose d'un serveur Postgres hérité de Dodonews. Il **ne faut pas effacer sa base**.

Configurer sur le service web:
- `PLANNER_DATABASE_URL=${{Postgres.DATABASE_URL}}` (référence Railway, pas de copie du secret)
- `SECRET_KEY_BASE`: valeur aléatoire longue
- `PLANNER_SETUP_TOKEN`: code à usage unique pour le premier compte
- `RAILS_ENV=production`

Le fichier `config/database.yml` sélectionne la base PostgreSQL distincte nommée `planner` sur la même instance, sans toucher à la base `railway` de Dodonews. Le lancement exécute `rails db:prepare`, puis Puma.

Ouvrir `/setup` pour créer le premier compte. Le formulaire devient indisponible après création du premier utilisateur. Protéger les identifiants: ne jamais les committer.

## Développement
`bundle install`, `rails db:prepare`, `rails server`. Une instance locale PostgreSQL est nécessaire.

## Historique
Le code Mordologie reste intact sur la branche `main`. Ce prototype utilise la branche `planner-rails`, qui contient une nouvelle arborescence Rails.

## Architecture et maintenance

Voir [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) pour le découpage des vues,
des styles, du JavaScript et les règles de maintenance obligatoires.
