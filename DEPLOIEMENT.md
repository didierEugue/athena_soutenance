# Déploiement (VPS Hostinger, Docker)

Quatre conteneurs derrière le Caddy d'entrée qui termine le TLS et renouvelle
les certificats Let's Encrypt tout seul :

| service    | rôle                                              | exposé sur               |
|------------|---------------------------------------------------|--------------------------|
| `web`      | front React (build Vite) servi en statique        | `WEB_DOMAIN`             |
| `api`      | Symfony 7.4 / API Platform sur FrankenPHP         | `API_DOMAIN`             |
| `upload`   | Express : pièces jointes + fichiers statiques     | `UPLOAD_DOMAIN`          |
| `database` | MariaDB 10.11                                     | réseau interne seulement |

## Pourquoi trois sous-domaines

Le front lit deux URL distinctes, `VITE_API_URL` et `VITE_UPLOAD_URL`, parce
que deux services différents répondent sur `/api/*` :

- **Symfony** sert les ressources API Platform (`/api/utilisateurs`,
  `/api/ordre_fabrications`, `/api/login_check`…) ;
- **Express** sert l'envoi et le listing des pièces jointes (`/api/upload`,
  `/api/avatar/:id`, `/api/of-upload`, `/api/rja-upload`,
  `/api/message-upload`, `/api/private-upload`, et les `/api/*/:id/fichiers`)
  **ainsi que** les fichiers eux-mêmes sur `/uploads/*`.

Les deux revendiquent le préfixe `/api`. Les séparer par sous-domaine évite un
routage par chemin dans Caddy, qu'il faudrait retoucher à chaque nouvelle
route.

## MariaDB, pas PostgreSQL

Contrairement aux deux autres stacks du VPS, Athena est sur **MySQL/MariaDB**.
L'unique migration Doctrine ([`Version20260610131109`](athena_back/migrations/Version20260610131109.php))
est du SQL MySQL — `AUTO_INCREMENT`, `ENUM`, `ENGINE = InnoDB` — et n'est pas
portable vers PostgreSQL. L'image de l'API embarque donc `pdo_mysql`.

L'API Symfony **et** le service d'upload écrivent dans la même base : Express
insère directement dans la table `fichiers` en SQL brut.

## Portier partagé

Cette stack **n'embarque pas de proxy** : sur ce VPS, les ports 80 et 443 sont
tenus par le Caddy de la Résidence Léonie (`escale-proxy-1`), qui sert de
portier aux trois applications et termine le TLS pour l'ensemble.

Ce que cela implique :

- le réseau Docker `proxy_public`, **créé hors compose** et déclaré `external`,
  relie le portier aux conteneurs de cette stack ;
- les conteneurs y sont joints par des **alias** (`athena-web`, `athena-api`,
  `athena-upload`) et non par leur nom de service : `web` et `api`
  désigneraient aussi les conteneurs d'Escale et de la plateforme éducative, et
  le portier en résoudrait un au hasard ;
- les blocs de domaines vivent dans
  `../residence_leonie/docker/caddy/Caddyfile`. Les noms de domaine y sont donc
  écrits **en double** avec `.env.prod` : toute modification doit être faite
  dans les deux fichiers ;
- `deploy.sh` recharge `escale-proxy-1` en fin de course.

Mise en place initiale (déjà faite sur ce VPS, à rejouer sur un nouveau) :

```bash
docker network create proxy_public
docker network connect proxy_public escale-proxy-1
```

## 1. DNS

Trois sous-domaines de `residence-leonie.com`, zone gérée dans hPanel
Hostinger, tous en **A** vers l'IP du VPS :

| nom                                    | rôle    |
|----------------------------------------|---------|
| `athena.residence-leonie.com`          | front   |
| `api.athena.residence-leonie.com`      | API     |
| `upload.athena.residence-leonie.com`   | uploads |

Attendre la propagation **avant** de recharger le portier : Let's Encrypt
vérifie le domaine par le port 80, et cinq échecs consécutifs déclenchent une
limite de taux d'une heure.

Le HSTS de Léonie porte `includeSubDomains` : ces sous-domaines sont donc
inaccessibles en HTTP pur pour tout navigateur ayant déjà visité
`residence-leonie.com`. Il n'y a pas de mode dégradé sans TLS.

## 2. Premier déploiement

```bash
git clone https://github.com/didierEugue/athena_soutenance.git
cd athena_soutenance
cp .env.prod.example .env.prod && chmod 600 .env.prod
# remplir .env.prod (secrets : openssl rand -hex 32)
docker network create proxy_public                    # si absent
docker network connect proxy_public escale-proxy-1    # si absent
./deploy.sh --no-pull
```

L'entrypoint de l'API attend MariaDB, génère la paire de clés JWT et applique
les migrations. Puis, une seule fois :

```bash
./charger_fixtures.sh
```

## 3. Données initiales

`AppFixtures` n'est pas décoratif : il crée les **rôles**, les **menus** — qui
pilotent la navigation du front — et les six comptes de démonstration. Aucune
commande de création de compte n'existe par ailleurs ; sans fixtures,
l'application n'a aucun utilisateur et son menu latéral est vide.

| compte                 | mot de passe | rôle                     |
|------------------------|--------------|--------------------------|
| `admin@athena.mg`      | `Admin@1234` | Direction                |
| `bet@athena.mg`        | `Bet@1234`   | Bureau d'Étude Technique |
| `rp@athena.mg`         | `Rp@1234`    | Responsable de Production|
| `technicien@athena.mg` | `Tech@1234`  | Technicien               |
| `os@athena.mg`         | `Os@1234`    | Ouvrier Spécialisé       |
| `manoeuvre@athena.mg`  | `Man@1234`   | Manœuvre                 |

⚠️ Ces mots de passe sont en clair dans
[`AppFixtures.php`](athena_back/src/DataFixtures/AppFixtures.php) : à changer
avant toute exposition durable au public.

`charger_fixtures.sh` passe par un étage `fixtures` du Dockerfile de l'API :
`doctrine-fixtures-bundle` est en `require-dev`, donc absent d'un
`composer install --no-dev`, et le bundle n'est enregistré que pour `dev`/`test`.
La commande n'existe donc pas dans l'image de production.

⚠️ `doctrine:fixtures:load` **purge** les tables avant d'insérer.

## 4. Mises à jour

```bash
./deploy.sh              # git pull + rebuild + redémarrage
./deploy.sh --no-pull    # rebuild du code local
```

## 5. Sauvegarde et réinitialisation

```bash
./backup_bd.sh                    # dump dans BD/athena_bd_JJ_MM_AAAA.sql (rotation 30 j)
./reset_bd.sh                     # remise à zéro + rechargement des fixtures
./reset_bd.sh --purger-fichiers   # vide aussi les fichiers téléversés
```

Sauvegarde quotidienne automatique (2 h du matin, heure du serveur) :

```bash
crontab -e
0 2 * * * cd /home/debian/projet/athena_soutenance && ./backup_bd.sh >> /var/log/backup_athena.log 2>&1
```

Restauration :

```bash
docker compose -f compose.prod.yaml --env-file .env.prod exec -T database \
  sh -c 'exec mariadb -u root -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"' \
  < BD/athena_bd_01_09_2026.sql
```

## 6. Écarts entre le code de développement et celui déployé

Corrections faites pour rendre le déploiement possible ou sûr :

- **[`security.yaml`](athena_back/config/packages/security.yaml)** — `^/api`
  était en `PUBLIC_ACCESS` : l'API entière était lisible et modifiable sans
  compte. Elle exige maintenant `IS_AUTHENTICATED_FULLY`, sauf `/api/login` et
  `/api/docs`.
- **[`FichierController.php`](athena_back/src/Controller/FichierController.php)** —
  deux `dd()` laissés du développement tuaient la requête et déversaient l'état
  interne dans la réponse. Retirés.
- **[`app.js`](api-upload-athena/app.js)** — `cors()` acceptait toutes les
  origines ; il est maintenant restreint à `CORS_ALLOW_ORIGIN`. Ajout de
  `trust proxy` (sinon les URL renvoyées sortaient en `http://` derrière le
  proxy) et d'une sonde `/health`.
- **[`config/uploadDir.js`](api-upload-athena/config/uploadDir.js)** — le
  dossier d'uploads était codé en relatif ; il est piloté par `UPLOAD_DIR` pour
  pointer sur un volume Docker. Sans ça, les fichiers vivaient dans la couche du
  conteneur et disparaissaient à chaque redéploiement.
- **[`AppFixtures.php`](athena_back/src/DataFixtures/AppFixtures.php)** —
  `Faker\Factory::create()` était instancié sans jamais être utilisé. Retiré
  plutôt que d'embarquer `fzaninotto/faker` v1.5 (2015, abandonné) sous PHP 8.4.
- **`athena_back/config/serializer/.gitkeep`** — `framework.yaml` déclare ce
  dossier dans `serializer.mapping.paths`, mais Git ne suit pas les dossiers
  vides : sur un clone frais, `cache:clear` échouait.

Points notés au passage, **non corrigés** :

- Le service d'upload n'exige **aucune authentification** : qui connaît
  `upload.athena.residence-leonie.com` peut téléverser un fichier (jpeg, png ou
  pdf, 5 Mo max) et lire ceux des autres. Le CORS ne protège que le navigateur,
  pas un appel direct.
- `PHP 8.4` est imposé par `composer.lock` (`doctrine/instantiator` 2.1.0), et
  non 8.3 comme les autres stacks.
- `yarn install` utilise `--pure-lockfile` : yarn 1.22 renormalise `yarn.lock`,
  ce que `--frozen-lockfile` prend pour une désynchronisation.
- Le build de l'image du front lance `vite build` sans le `tsc` du script
  `yarn build` : le thème Metronic est en `strict: true` et ses erreurs de type
  n'affectent pas le bundle, que SWC produit sans vérifier les types.
- `VITE_APP_THEME_API_URL` est lu par deux écrans hérités de la démo Metronic
  ([`users-list/core/_requests.ts`](front/src/app/modules/apps/user-management/users-list/core/_requests.ts))
  mais n'est défini nulle part : ces écrans appellent `undefined/...`.

## Exploitation courante

```bash
CO="docker compose -f compose.prod.yaml --env-file .env.prod"
$CO ps                      # état des conteneurs
$CO logs -f api             # logs de l'API
$CO logs -f upload          # logs du service d'upload
$CO exec database sh -c 'mariadb -u root -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"'
```
