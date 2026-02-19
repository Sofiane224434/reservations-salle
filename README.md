# Réservation de Salle

## � Démarrage Rapide

### Prérequis
- Node.js (v16 ou supérieur)
- MySQL
- npm ou yarn

### Installation

```bash
# Installation Backend
cd backend
npm install
npm run dev

# Installation Frontend (dans un nouveau terminal)
cd frontend
npm install
npm run dev

#Copier coller les variables d'environnement
cp /backend/.env.example /backend/.env cp /frontend/.env.example /frontend/.env
```

### Lancement

- **Backend** : `http://localhost:5000`
- **Frontend** : `http://localhost:5173`

---

## 📋 Description

Application fullstack de réservation de salles de réunion pour une entreprise. Elle permet aux membres de l'entreprise de consulter un planning, de réserver des salles et de gérer leurs réservations. L'architecture est découplée : un backend API REST en Node.js/Express et un frontend React avec un calendrier interactif.

## 🏗️ Architecture du Projet

```
reservations-salle/
├── backend/          # API REST Node.js/Express 5
├── conception/       # Documents de conception (use cases, schéma SQL)
├── frontend/         # Application React 19 + Vite 7
└── README.md
```

---

## 🔧 Backend

### Structure

```
backend/
├── config/
│   └── db.js                      # Pool de connexions MySQL2
├── controllers/
│   ├── auth.controller.js         # Logique inscription / connexion
│   └── reservation.controller.js  # Logique CRUD des réservations
├── middlewares/
│   └── auth.middleware.js         # Vérification du token JWT
├── models/
│   ├── user.model.js              # Modèle utilisateur
│   └── reservation.model.js       # Modèle réservation
├── routes/
│   ├── auth.routes.js             # Routes /api/auth
│   └── reservation.routes.js      # Routes /api/reservations
├── package.json
└── server.js                      # Point d'entrée Express
```

### Technologies Backend

| Technologie | Version | Rôle |
|---|---|---|
| **Node.js** | v16+ | Environnement d'exécution |
| **Express** | ^5.2.1 | Framework HTTP / REST |
| **mysql2** | ^3.16.3 | Client MySQL (Promise, pool) |
| **jsonwebtoken** | ^9.0.3 | Authentification JWT |
| **bcrypt** | ^6.0.0 | Hachage des mots de passe |
| **cors** | ^2.8.6 | Gestion du Cross-Origin |
| **dotenv** | ^17.2.4 | Variables d'environnement |

### Configuration `.env` (backend)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=reservations_salle
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Responsabilités

- **config/db.js** : Pool de connexions MySQL2 (limite 10), wrapper `query()` et `testConnection()`
- **controllers/** : Logique métier — authentification et CRUD réservations
- **middlewares/auth.middleware.js** : Vérifie et décode le token JWT dans l'en-tête `Authorization`
- **models/** : Requêtes SQL et interactions avec la base de données
- **routes/** : Déclaration des endpoints et branchement sur les controllers

---

## 🎨 Frontend

### Structure

```
frontend/
├── public/
│   └── assets/img/          # Images statiques
├── src/
│   ├── assets/icons/        # Icônes SVG
│   ├── components/          # Composants réutilisables
│   │   ├── Calendar.jsx     # Calendrier FullCalendar
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── PrivateRoute.jsx # Protection des routes authentifiées
│   ├── contexts/
│   │   └── AuthContext.jsx  # État d'authentification global
│   ├── hooks/
│   │   └── useAuth.js       # Accès simplifié à AuthContext
│   ├── layouts/
│   │   ├── AuthLayout.jsx   # Layout connexion / inscription
│   │   └── MainLayout.jsx   # Layout principal (Header + Footer)
│   ├── pages/
│   │   ├── Home.jsx         # Page d'accueil
│   │   ├── Login.jsx        # Connexion
│   │   ├── Register.jsx     # Inscription
│   │   ├── Planning.jsx     # Planning / calendrier des réservations
│   │   └── Profil.jsx       # Profil utilisateur
│   ├── services/
│   │   └── api.js           # Appels HTTP vers l'API backend
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── eslint.config.js
├── index.html
└── package.json
```

### Technologies Frontend

| Technologie | Version | Rôle |
|---|---|---|
| **React** | ^19.2.0 | Bibliothèque UI |
| **React Router DOM** | ^7.13.0 | Routing côté client |
| **Vite** | ^7.3.1 | Build tool et dev server |
| **TailwindCSS** | ^4.1.18 | Styles utilitaires |

### Architecture Frontend

#### Composants (`components/`)

- **Calendar** : Affiche le planning des réservations via FullCalendar (vue grille horaire et multi-mois)
- **Header** : Barre de navigation (liens + état de connexion)
- **Footer** : Pied de page
- **PrivateRoute** : Redirige vers Login si l'utilisateur n'est pas authentifié

#### Contextes (`contexts/`)

- **AuthContext** : Fournit `user`, `token`, `login()` et `logout()` à toute l'application

#### Hooks (`hooks/`)

- **useAuth** : Raccourci `useContext(AuthContext)`

#### Layouts (`layouts/`)

- **AuthLayout** : Enveloppe les pages Login et Register
- **MainLayout** : Enveloppe les pages protégées avec Header et Footer

#### Pages (`pages/`)

- **Home** : Page d'accueil publique
- **Login** : Formulaire de connexion
- **Register** : Formulaire d'inscription
- **Planning** : Calendrier interactif des réservations (route protégée)
- **Profil** : Informations et réservations de l'utilisateur connecté

#### Services (`services/`)

- **api.js** : Fonctions fetch vers le backend, gestion du token JWT dans les en-têtes

---

## 🔐 Système d'Authentification

1. **Inscription** : formulaire Register → `POST /api/auth/register` → création du compte en BD + token JWT retourné
2. **Connexion** : formulaire Login → `POST /api/auth/login` → vérification des credentials + token JWT stocké côté client
3. **Routes protégées** : `auth.middleware.js` valide le token JWT sur chaque requête privée ; `PrivateRoute` protège les pages React

---

## 📡 API Endpoints

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| POST | `/api/auth/register` | Inscription d'un nouvel utilisateur | Public |
| POST | `/api/auth/login` | Connexion utilisateur | Public |
| GET | `/api/auth/profile` | Récupérer le profil utilisateur | Privé (JWT) |

### Réservations (`/api/reservations`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| GET | `/api/reservations` | Lister toutes les réservations | Privé (JWT) |
| POST | `/api/reservations` | Créer une réservation | Privé (JWT) |
| PUT | `/api/reservations/:id` | Modifier une réservation | Privé (JWT) |
| DELETE | `/api/reservations/:id` | Supprimer une réservation | Privé (JWT) |

---

## 🛠️ Scripts Disponibles

### Backend

```bash
npm start        # Lancer le serveur en production
npm run dev      # Lancer avec node --watch (rechargement auto)
```

### Frontend

```bash
npm run dev      # Serveur de développement Vite
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Vérifier le code avec ESLint
```

---

## 📦 Dépendances Principales

### Backend

- `express` ^5.2.1
- `mysql2` ^3.16.3
- `jsonwebtoken` ^9.0.3
- `bcrypt` ^6.0.0
- `cors` ^2.8.6
- `dotenv` ^17.2.4

### Frontend

- `react` ^19.2.0
- `react-router-dom` ^7.13.0
- `tailwindcss` ^4.1.18
---

## 🎯 Bonnes Pratiques

1. **Architecture découplée** : Backend et frontend totalement indépendants
2. **Architecture MVC** : Models, Controllers et Routes clairement séparés
3. **Composants réutilisables** : Calendar, Header, Footer, PrivateRoute
4. **State Management** : Context API pour l'état d'authentification global
5. **Sécurité** : JWT + bcrypt, middleware de validation sur toutes les routes privées
6. **Performance** : Pool de connexions MySQL, ES Modules natifs, Vite pour le bundling

---

## 📝 Licence

Projet de réservation de salles — développé dans le cadre d'un usage interne entreprise.
