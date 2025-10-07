# 📇 MyContacts

**MyContacts** est une application web permettant de gérer ses contacts personnels et professionnels facilement.  
L’utilisateur peut s’inscrire, se connecter et effectuer des opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) sur ses contacts, de manière sécurisée.

---

## 🚀 Démonstration en ligne

- **Frontend (React / Netlify)** : https://mycontacts-frontend-thanus.netlify.app
- **Backend (Express / Render)** : [https://mycontacts-backend-mr9x.onrender.com/](https://mycontacts-backend-mr9x.onrender.com/)
- **Documentation Swagger** : [https://mycontacts-backend-mr9x.onrender.com/api-docs](https://mycontacts-backend-mr9x.onrender.com/api-docs)

---

## 🧩 Architecture du projet

```bash
MyContacts/
│
├── client/ # Frontend React
│ ├── src/
│ │ ├── components/ # Navbar, etc.
│ │ ├── pages/ # Login, Register, Contacts
│ │ ├── App.jsx
│ │ └── index.js
│ └── package.json
│
├── server/ # Backend Express + MongoDB
│ ├── controllers/ # Logique métier (auth, contacts)
│ ├── middleware/ # Middlewares (authentification, sécurité)
│ ├── models/ # Schémas Mongoose
│ ├── routes/ # Routes API
│ ├── tests/ # Tests Jest & Supertest
│ ├── server.js # Point d’entrée du serveur
│ └── package.json
│
├── .env # Variables d’environnement
└── README.md # Documentation du projet
```


---

## 🛠️ Stack technique

### **Frontend**
- ⚛️ [React](https://react.dev/) — interface utilisateur dynamique  
- 🌐 [React Router DOM](https://reactrouter.com/) — navigation entre pages  
- 💅 CSS inline / Flexbox — mise en page simple et responsive  
- 📦 Déploiement : [Netlify](https://www.netlify.com/)

### **Backend**
- 🧠 [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — serveur et API REST  
- 🗄️ [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — base de données NoSQL  
- 🔐 [JWT (JSON Web Token)](https://jwt.io/) — authentification sécurisée  
- 🧂 [bcrypt](https://www.npmjs.com/package/bcrypt) — hachage des mots de passe  
- 🧭 [Swagger UI](https://swagger.io/tools/swagger-ui/) — documentation interactive de l’API  
- ☁️ Déploiement : [Render](https://render.com/)

---

## 🔐 Fonctionnalités principales

| Fonction | Description |
|-----------|-------------|
| 🧍 Inscription | Création d’un compte utilisateur avec email et mot de passe |
| 🔑 Connexion | Authentification via JWT |
| 📇 Gestion des contacts | Ajout, modification et suppression de contacts |
| 🔍 Sécurité | Hash des mots de passe et vérification du token JWT via un middleware |
| 📘 Swagger | Documentation interactive de toutes les routes API |
| 🧪 Tests Jest | Vérification des routes `/auth` et `/contacts` |

---

## ⚙️ Installation locale

### 1️⃣ Cloner le dépôt
```bash
git clone https://github.com/ShanthakumarThanus/MyContacts.git
cd MyContacts
```

### 2️⃣ Installer les dépendances
Backend :

cd server
npm install
