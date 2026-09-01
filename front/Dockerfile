# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Front Athena (React + Vite) — build statique servi par Caddy.
# Les VITE_* sont inlinees au build : changer une URL impose de reconstruire
# l'image (`./deploy.sh` s'en charge).
#
# yarn et non npm : package.json declare une auto-dependance `"demo8": "file:"`
# que `npm ci` refuse. Elle est resolue dans yarn.lock, et le paquet n'est
# importe nulle part dans src/.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
# --pure-lockfile et non --frozen-lockfile : yarn 1.22 renormalise le lockfile
# (regroupement des cles, binaires Rollup/esbuild propres a la plateforme) et
# --frozen-lockfile prend cette derive de mise en forme pour une desynchro.
# --pure-lockfile installe les memes resolutions sans reecrire yarn.lock.
RUN yarn install --pure-lockfile --non-interactive --network-timeout 600000

ARG VITE_API_URL
ARG VITE_UPLOAD_URL
ARG VITE_APP_BASE_LAYOUT_CONFIG_KEY=metronic-react-demo8-8150
ENV VITE_API_URL=$VITE_API_URL \
    VITE_UPLOAD_URL=$VITE_UPLOAD_URL \
    VITE_APP_BASE_LAYOUT_CONFIG_KEY=$VITE_APP_BASE_LAYOUT_CONFIG_KEY \
    NODE_ENV=production

COPY . .

# `yarn build` du depot est `tsc && vite build`. Le tsc est volontairement
# ecarte ici : le theme Metronic est en `strict: true` et ses erreurs de type
# n'ont aucun effet sur le bundle, que SWC produit en supprimant les types sans
# les verifier. Le type-check reste disponible en developpement (`yarn build`).
# --max-old-space-size : le bundle depasse la limite par defaut de Node.
RUN NODE_OPTIONS=--max-old-space-size=3072 npx vite build

FROM caddy:2-alpine AS runner
COPY --from=builder /app/dist /srv
COPY docker/Caddyfile /etc/caddy/Caddyfile

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO /dev/null http://127.0.0.1:8080/ || exit 1
