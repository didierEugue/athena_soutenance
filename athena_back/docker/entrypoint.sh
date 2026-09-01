#!/bin/sh
set -e

if [ "$1" = 'frankenphp' ] || [ "$1" = 'php' ] || [ "$1" = 'bin/console' ]; then

	mkdir -p var/cache var/log public/uploads/pieces_jointes public/uploads/files config/jwt

	# --- fuseau horaire ----------------------------------------------------
	# date.timezone ne lit pas l'environnement : le fichier est ecrit au
	# demarrage pour que TZ (defini dans .env.prod) pilote aussi PHP, sinon les
	# dates d'agenda et de rapport journalier s'affichent en UTC.
	printf 'date.timezone = %s\n' "${TZ:-UTC}" > /usr/local/etc/php/conf.d/zz-timezone.ini

	# --- attente de MariaDB ------------------------------------------------
	echo '[entrypoint] attente de la base…'
	tries=0
	until php bin/console dbal:run-sql 'SELECT 1' >/dev/null 2>&1; do
		tries=$((tries + 1))
		if [ "$tries" -ge 60 ]; then
			echo '[entrypoint] base injoignable apres 60 essais' >&2
			exit 1
		fi
		sleep 2
	done
	echo '[entrypoint] base OK'

	# --- cles JWT (persistees dans le volume api_jwt) ----------------------
	if [ ! -f config/jwt/private.pem ]; then
		echo '[entrypoint] generation de la paire de cles JWT…'
		php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction
	fi

	# --- schema ------------------------------------------------------------
	# Pas de --all-or-nothing : MySQL/MariaDB ne sait pas annuler un DDL dans
	# une transaction, l'option n'y apporte rien et fait echouer la commande.
	echo '[entrypoint] migrations Doctrine…'
	php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

	php bin/console cache:warmup --no-interaction || true

	chown -R www-data:www-data var public/uploads config/jwt
fi

exec docker-php-entrypoint "$@"
