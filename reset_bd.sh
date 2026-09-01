#!/usr/bin/env bash
#
# Remise a zero de la base Athena : le schema est recree par les migrations,
# puis les fixtures sont rechargees.
#
#   ./reset_bd.sh                     # base seule
#   ./reset_bd.sh --purger-fichiers   # vide aussi les fichiers televerses
#
# Une sauvegarde est prise avant ; l'operation est annulee si elle echoue.

set -euo pipefail

cd "$(dirname "$0")"

COMPOSE=(docker compose -f compose.prod.yaml --env-file .env.prod)
PURGER_FICHIERS=0
[[ "${1:-}" == "--purger-fichiers" ]] && PURGER_FICHIERS=1

echo "⚠  Toutes les donnees d'Athena vont etre effacees (utilisateurs, affaires,"
echo "   ordres de fabrication, messages, agendas)."
[[ $PURGER_FICHIERS -eq 1 ]] && echo "   Les fichiers televerses seront supprimes eux aussi."
read -rp "Taper « oui » pour confirmer : " reponse
[[ "$reponse" == "oui" ]] || { echo "Annule."; exit 1; }

echo "→ sauvegarde prealable"
./backup_bd.sh

echo "→ suppression et recreation du schema"
"${COMPOSE[@]}" exec -T database \
	sh -c 'exec mariadb -u root -p"$MARIADB_ROOT_PASSWORD" \
		-e "DROP DATABASE IF EXISTS \`$MARIADB_DATABASE\`;
		    CREATE DATABASE \`$MARIADB_DATABASE\`
		      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
		    GRANT ALL ON \`$MARIADB_DATABASE\`.* TO \`$MARIADB_USER\`@\`%\`;"'

if [[ $PURGER_FICHIERS -eq 1 ]]; then
	echo "→ purge des fichiers televerses"
	"${COMPOSE[@]}" exec -T upload sh -c 'rm -rf /app/uploads/* || true'
	"${COMPOSE[@]}" exec -T api sh -c 'rm -rf /app/public/uploads/*/* || true'
fi

echo "→ migrations (redemarrage de l'API, son entrypoint s'en charge)"
"${COMPOSE[@]}" restart api
"${COMPOSE[@]}" exec -T api sh -c 'until php bin/console dbal:run-sql "SELECT 1 FROM utilisateur LIMIT 1" >/dev/null 2>&1; do sleep 2; done'

echo "→ rechargement des fixtures"
./charger_fixtures.sh

echo "✓ base reinitialisee"
