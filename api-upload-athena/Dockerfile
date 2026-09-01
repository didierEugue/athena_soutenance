# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Service d'upload Athena — Express + Multer.
# Il porte deux roles que le front appelle via VITE_UPLOAD_URL :
#   - les routes /api/* d'envoi et de listing des pieces jointes ;
#   - le service statique des fichiers sur /uploads/*.
# Il ecrit dans la MEME base MySQL que l'API Symfony (table `fichiers`).
# ---------------------------------------------------------------------------
FROM node:22-alpine

ENV NODE_ENV=production \
    UPLOAD_DIR=/app/uploads

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Les fichiers televerses vivent dans un volume monte ici : sans ca ils
# seraient dans la couche du conteneur et disparaitraient a chaque
# redeploiement.
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO /dev/null http://127.0.0.1:3000/health || exit 1

CMD ["node", "app.js"]
