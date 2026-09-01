#!/usr/bin/env bash
# Deploiement / mise a jour de la stack Athena sur le VPS.
#   ./deploy.sh            → pull git + rebuild + redemarrage
#   ./deploy.sh --no-pull  → rebuild depuis le code local
set -euo pipefail

cd "$(dirname "$0")"

COMPOSE=(docker compose -f compose.prod.yaml --env-file .env.prod)

if [[ ! -f .env.prod ]]; then
	echo "✗ .env.prod manquant — copiez .env.prod.example et remplissez-le." >&2
	exit 1
fi

if [[ "${1:-}" != "--no-pull" ]]; then
	echo "→ git pull"
	git pull --ff-only
fi

echo "→ build des images"
"${COMPOSE[@]}" build --pull

echo "→ demarrage"
# Les migrations et la generation des cles JWT sont faites par l'entrypoint de
# l'API.
"${COMPOSE[@]}" up -d --remove-orphans

# Le portier appartient a une autre stack (Residence Leonie) et son Caddyfile
# est un montage bind : il faut le recharger a la main pour qu'un bloc de
# domaine ajoute ou modifie soit pris en compte.
if docker ps --format '{{.Names}}' | grep -qx escale-proxy-1; then
	echo "→ rechargement de la config Caddy du portier"
	docker exec escale-proxy-1 caddy reload --config /etc/caddy/Caddyfile 2>/dev/null \
		|| echo "  (rechargement ignore)"
fi

echo "→ nettoyage des images orphelines"
docker image prune -f >/dev/null

echo "→ etat"
"${COMPOSE[@]}" ps
