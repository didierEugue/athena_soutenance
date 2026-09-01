#!/usr/bin/env bash
#
# Exporte la base MariaDB dans BD/athena_bd_JJ_MM_AAAA.sql
#
#   ./backup_bd.sh              # export du jour
#   RETENTION_JOURS=90 ./backup_bd.sh
#
# Bash requis (tableaux, [[ ]]) : lancez ./backup_bd.sh, pas `sh backup_bd.sh`.

set -euo pipefail

cd "$(dirname "$0")"

# Les dumps contiennent les comptes utilisateurs et les donnees clients :
# personne d'autre que root ne doit pouvoir les lire.
umask 077

OUT_DIR="BD"
RETENTION_JOURS="${RETENTION_JOURS:-30}"
COMPOSE=(docker compose -f compose.prod.yaml --env-file .env.prod)

TZ_APP="$(grep -E '^TZ=' .env.prod | cut -d= -f2- | tr -d '"' || true)"
DATE="$(TZ="${TZ_APP:-UTC}" date +%d_%m_%Y)"
DEST="$OUT_DIR/athena_bd_${DATE}.sql"
TMP="$DEST.partiel"

mkdir -p "$OUT_DIR"

# Ecriture dans un fichier temporaire puis renommage : une erreur en cours de
# route ne laisse jamais un .sql tronque que l'on croirait exploitable.
if ! "${COMPOSE[@]}" exec -T database \
		sh -c 'exec mariadb-dump --single-transaction --routines \
			-u root -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"' > "$TMP"; then
	rm -f "$TMP"
	echo "✗ mariadb-dump a echoue — aucun fichier ecrit" >&2
	exit 1
fi

mv "$TMP" "$DEST"
echo "✓ $DEST ($(du -h "$DEST" | cut -f1))"

# Rotation
find "$OUT_DIR" -name 'athena_bd_*.sql' -mtime "+$RETENTION_JOURS" -print -delete
