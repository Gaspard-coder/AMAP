# Les Paniers du Mont-Gargan

Application web accessible et sécurisée pour présenter une AMAP.

## Étape 1 — Structure du repository

```text
.
├── Dockerfile
├── README.md
├── package.json
├── server.js
├── .dockerignore
├── documents/
│   ├── charte-adhesion.pdf
│   ├── formulaire-adhesion.pdf
│   └── notice-fonctionnement.pdf
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── scripts/
    └── start.sh
```

## Étape 2 — Backend Node.js / Express sécurisé

Le serveur (`/home/runner/work/AMAP/AMAP/server.js`) inclut :
- `helmet` pour les en-têtes HTTP de sécurité.
- `cors` configurable via `CORS_ORIGIN` (par défaut sans restriction d'origine explicite côté navigateur non-CORS/local).
- `express-rate-limit` pour limiter les requêtes.
- Service statique de `public/`.
- Route sécurisée `GET /documents/:filename` qui :
  - accepte uniquement des noms de fichiers `.pdf` sûrs,
  - interdit la traversal de répertoires,
  - renvoie 404 si le document n'existe pas.

## Étape 3 — Frontend accessible (HTML/CSS/JS vanilla)

Le frontend (`/home/runner/work/AMAP/AMAP/public/`) propose :
- Sections demandées : Accueil, Provenance des produits, Histoire de l'AMAP, Fonctionnement, Adhésion.
- Zone de téléchargement PDF.
- Accessibilité renforcée :
  - structure sémantique (`header`, `nav`, `main`, `section`, `footer`),
  - lien d'évitement clavier,
  - titres explicites et navigation simple,
  - contrastes élevés, boutons clairs, grandes polices,
  - design responsive sans animations inutiles.

## Étape 4 — Dépendances et scripts

`/home/runner/work/AMAP/AMAP/package.json` contient :
- `express`
- `helmet`
- `cors`
- `express-rate-limit`

Scripts :
- `npm start` : lance le serveur.
- `npm run dev` : alias simple de démarrage local.

## Étape 5 — Exécution locale et production conteneurisée

### Prérequis
- Node.js 20+
- npm 10+

### Lancement local

```bash
cd /home/runner/work/AMAP/AMAP
npm install
npm start
```

Application disponible sur `http://localhost:3000`.

Variables utiles :
- `PORT` (défaut `3000`)
- `CORS_ORIGIN` (ex. `https://mon-domaine.fr,https://admin.mon-domaine.fr`)

### Déploiement Docker (standardisation)

```bash
cd /home/runner/work/AMAP/AMAP
docker build -t amap-mont-gargan .
docker run --rm -p 3000:3000 --name amap amap-mont-gargan
```

### Déploiement LXC (principe)

Dans le conteneur LXC :

```bash
cd /home/runner/work/AMAP/AMAP
./scripts/start.sh
```

Le script installe les dépendances de production et démarre l'application.

## Vérifications manuelles recommandées

- Ouvrir l'accueil et vérifier la lisibilité (taille/contraste/navigation clavier).
- Tester les liens PDF :
  - `/documents/charte-adhesion.pdf`
  - `/documents/notice-fonctionnement.pdf`
  - `/documents/formulaire-adhesion.pdf`
- Vérifier qu'une tentative de traversal est bloquée :
  - `/documents/../server.js`
