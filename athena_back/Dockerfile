# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# API Athena — Symfony 7.4 / API Platform servi par FrankenPHP (Caddy + PHP).
# PHP 8.4 et non 8.3 : composer.lock verrouille doctrine/instantiator 2.1.0,
# qui exige ^8.4.
# Le conteneur ecoute en clair sur :80 ; le TLS est termine par le Caddy
# d'entree (escale-proxy-1).
#
# Base MySQL/MariaDB, et non PostgreSQL comme les autres stacks du VPS :
# l'unique migration Doctrine est du SQL MySQL (AUTO_INCREMENT, ENUM,
# ENGINE = InnoDB), non portable. D'ou pdo_mysql ci-dessous.
# ---------------------------------------------------------------------------
FROM dunglas/frankenphp:php8.4 AS base

# Extensions : pdo_mysql (Doctrine), intl (Symfony), zip + gd (Vich, images),
# opcache (perf prod).
RUN install-php-extensions \
        @composer \
        intl \
        opcache \
        pdo_mysql \
        zip \
        gd \
    && apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

ENV APP_ENV=prod \
    APP_DEBUG=0 \
    COMPOSER_ALLOW_SUPERUSER=1 \
    SERVER_NAME=:80

WORKDIR /app

# --- dependances (couche cachee tant que composer.lock ne bouge pas) --------
COPY composer.json composer.lock symfony.lock ./
RUN composer install \
        --no-dev --no-scripts --no-autoloader \
        --prefer-dist --no-interaction --no-progress

# --- code applicatif --------------------------------------------------------
COPY . .

RUN composer dump-autoload --classmap-authoritative --no-dev \
    && composer run-script --no-dev post-install-cmd \
    && mkdir -p var public/uploads/pieces_jointes public/uploads/files config/jwt \
    && chown -R www-data:www-data var public/uploads config/jwt

# ---------------------------------------------------------------------------
# Etage `fixtures` — sert uniquement a charger AppFixtures (roles, menus et les
# six comptes de demonstration). doctrine/doctrine-fixtures-bundle est en
# require-dev, donc absent d'un `composer install --no-dev`, et le bundle n'est
# enregistre que pour dev/test : la commande n'existe pas dans l'image de prod.
# Cet etage installe les dependances de dev et boote le kernel en `dev`, le
# temps d'un `docker run` (voir DEPLOIEMENT.md).
# ---------------------------------------------------------------------------
FROM base AS fixtures
ENV APP_ENV=dev APP_DEBUG=1
RUN composer install --prefer-dist --no-interaction --no-progress --no-scripts \
    && composer dump-autoload
CMD ["php", "bin/console", "doctrine:fixtures:load", "--no-interaction", "--env=dev"]

# ---------------------------------------------------------------------------
# Etage `prod` — l'image reellement deployee. Dernier etage du fichier, donc
# cible par defaut de `docker compose build`.
# ---------------------------------------------------------------------------
FROM base AS prod

COPY docker/Caddyfile     /etc/frankenphp/Caddyfile
COPY docker/php.ini       /usr/local/etc/php/conf.d/app.ini
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

# /api/login_check n'existe qu'en POST : un GET repond 405, ce qui suffit a
# prouver que PHP et le routeur repondent (curl sans -f ne traite pas 405 comme
# un echec).
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
    CMD curl -sS -o /dev/null http://127.0.0.1:80/api/login_check || exit 1

EXPOSE 80
ENTRYPOINT ["entrypoint"]
CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile"]
