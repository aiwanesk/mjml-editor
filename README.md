# MJML Template Editor

Éditeur de templates MJML visuel pour utilisateurs non-techniques.

## Stack

- **Frontend** : React (Vite)
- **Backend** : Node.js (Express)
- **Architecture** : DDD (Domain-Driven Design)
- **Format templates** : MJML

## Prérequis

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9 (ou yarn / pnpm)

## Structure du projet

```
├── client/          # Frontend React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
├── server/          # Backend Node.js (Express)
│   ├── src/
│   │   ├── domain/          # Entités, Value Objects, Events
│   │   ├── application/     # Use Cases, Commands, Queries
│   │   ├── infrastructure/  # Repos, Services externes
│   │   └── interfaces/      # Controllers, Routes
│   └── package.json
├── docs/            # Documentation (User Stories, etc.)
└── package.json     # Root (scripts monorepo)
```

## Installation

```bash
# Cloner le repo
git clone git@github.com:aiwanesk/mjml-editor.git
cd mjml-editor

# Installer les dépendances (workspaces : root + client + server)
npm install
```

## Lancement

### Dev (front + back en parallèle)

```bash
# Terminal 1 - Backend (port 3001)
cd server
npm run dev

# Terminal 2 - Frontend (port 5173)
cd client
npm run dev
```

Ou avec concurrently depuis la racine (une fois configuré) :

```bash
npm run dev
```

### Variables d'environnement

Créer un fichier `.env` dans `server/` :

```env
PORT=3001
NODE_ENV=development
```

Créer un fichier `.env` dans `client/` :

```env
VITE_API_URL=http://localhost:3001/api
```

## Scripts disponibles

| Dossier    | Commande           | Description                          |
| ---------- | ------------------ | ------------------------------------ |
| `root`     | `npm run dev`      | Lance front + back en parallèle     |
| `client/`  | `npm run dev`      | Lance le front en mode dev           |
| `client/`  | `npm run build`    | Build de production du front         |
| `server/`  | `npm run dev`      | Lance le back avec hot reload        |
| `server/`  | `npm run build`    | Compile le TypeScript                |
| `server/`  | `npm run start`    | Lance le back compilé (production)   |
| `server/`  | `npm run test`     | Lance les tests                      |

## Documentation

- [User Stories](./docs/user-stories.md)
