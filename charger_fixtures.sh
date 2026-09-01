#!/usr/bin/env bash
#
# Charge AppFixtures : roles, menus (ils pilotent la navigation du front) et
# les six comptes de demonstration. Sans eux l'application n'a aucun compte et
# le menu lateral est vide.
#
#   ./charger_fixtures.sh
#
# Pourquoi un `docker run` et pas un `exec api` : doctrine-fixtures-bundle et
# faker sont en require-dev, donc absents de l'image de prod (`composer install
# --no-dev`), et le bundle n'est enregistre que pour dev/test. L'etage
# `fixtures` du Dockerfile de l'API porte ces dependances et boote le kernel en
# `dev`, le temps d'un conteneur ephemere.
#
# ⚠  doctrine:fixtures:load PURGE les tables avant d'inserer.

set -euo pipefail

cd "$(dirname "$0")"

[[ -f .env.prod ]] || { echo "✗ .env.prod manquant" >&2; exit 1; }
set -a && . ./.env.prod && set +a

echo "⚠  Les tables d'Athena vont etre purgees puis reremplies avec les"
echo "   donnees de demonstration."
read -rp "Taper « oui » pour confirmer : " reponse
[[ "$reponse" == "oui" ]] || { echo "Annule."; exit 1; }

echo "→ construction de l'etage fixtures"
docker build --target fixtures -t athena/api-fixtures:latest ./athena_back

# Compose retire les commentaires de fin de ligne, `docker run --env-file` non :
# sans ce filtre, une valeur suivie d'un commentaire serait prise en entier.
TMP_ENV="$(mktemp)"
chmod 600 "$TMP_ENV"
trap 'rm -f "$TMP_ENV"' EXIT

{
	echo "APP_ENV=dev"
	echo "APP_DEBUG=0"
	echo "APP_SECRET=$APP_SECRET"
	echo "JWT_PASSPHRASE=$JWT_PASSPHRASE"
	echo "JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem"
	echo "JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem"
	echo "CORS_ALLOW_ORIGIN=$CORS_ALLOW_ORIGIN"
	echo "MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0"
	echo "DATABASE_URL=mysql://$MYSQL_USER:$MYSQL_PASSWORD@database:3306/$MYSQL_DATABASE?serverVersion=${MARIADB_SERVER_VERSION:-10.11.6-MariaDB}&charset=utf8mb4"
} > "$TMP_ENV"

echo "→ chargement"
docker run --rm --network athena_backend --env-file "$TMP_ENV" \
	athena/api-fixtures:latest \
	php bin/console doctrine:fixtures:load --no-interaction --env=dev

cat <<'TXT'

✓ Fixtures chargees. Comptes de demonstration :

    admin@athena.mg        Admin@1234    Direction
    bet@athena.mg          Bet@1234      Bureau d'Etude Technique
    rp@athena.mg           Rp@1234       Responsable de Production
    technicien@athena.mg   Tech@1234     Technicien
    os@athena.mg           Os@1234       Ouvrier Specialise
    manoeuvre@athena.mg    Man@1234      Manoeuvre

⚠  Ces mots de passe sont en clair dans src/DataFixtures/AppFixtures.php.
   A changer avant toute exposition durable au public.
TXT
