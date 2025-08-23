<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
=======
# CuraTime - Plateforme de Gestion de Rendez-vous Médicaux

![CuraTime Logo](https://img.shields.io/badge/CuraTime-Medical%20Appointments-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Django-4.x-092E20?logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791?logo=postgresql)

## 📋 Description

CuraTime est une plateforme moderne de gestion de rendez-vous médicaux qui connecte les patients avec des spécialistes de santé. L'application offre une interface intuitive pour la prise de rendez-vous, la gestion des profils et le suivi des consultations.

## ✨ Fonctionnalités Principales

### 👥 Pour les Patients
- **Inscription et Authentification** sécurisée
- **Recherche de Médecins** par spécialité, nom ou localisation
- **Prise de Rendez-vous** en ligne avec calendrier interactif
- **Gestion des Rendez-vous** (modification, annulation)
- **Tableau de Bord** personnalisé avec statistiques
- **Profil Utilisateur** modifiable
- **Historique** des consultations

### 🩺 Pour les Médecins
- **Connexion Professionnelle** dédiée
- **Gestion des Disponibilités** avec calendrier
- **Suivi des Patients** et rendez-vous
- **Mise à jour du Statut** des consultations
- **Profil Professionnel** détaillé

### 👨‍💼 Pour les Administrateurs
- **Gestion des Médecins** (ajout, modification, suppression)
- **Gestion des Spécialités** médicales
- **Supervision des Rendez-vous**
- **Statistiques Globales**

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **React Router** pour la navigation
- **Context API** pour la gestion d'état
- **React Hook Form** pour les formulaires
- **Axios** pour les appels API
- **React Toastify** pour les notifications

### Backend
- **Django 4.x** avec Django REST Framework
- **PostgreSQL** comme base de données
- **JWT Authentication** pour la sécurité
- **CORS** configuré pour React
- **Pipenv** pour la gestion des dépendances

## 🚀 Installation et Configuration

### Prérequis
- Node.js 16+ et npm
- Python 3.8+
- PostgreSQL 12+
- Git

### 1. Cloner le Projet
```bash
git clone https://github.com/votre-username/curatime.git
cd curatime
```

### 2. Configuration du Backend (Django)
```bash
cd PPG-main

# Installer pipenv si nécessaire
pip install pipenv

# Installer les dépendances
pipenv install

# Activer l'environnement virtuel
pipenv shell

# Configuration de la base de données PostgreSQL
# Créer une base de données nommée 'PPG'
# Utilisateur: postgres, Mot de passe: admin1234

# Appliquer les migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Ajouter des données de test
python add_test_data.py

# Lancer le serveur Django
python manage.py runserver
```

### 3. Configuration du Frontend (React)
```bash
cd curatime-frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

## 🌐 URLs d'Accès

- **Frontend React**: http://localhost:3000
- **Backend Django**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/

## 👤 Comptes de Test

### Patient
- **Email**: client@test.com
- **Mot de passe**: client123

### Médecins
- **Dr. Jean Dupont**: dr.dupont@hospital.com / doctor123
- **Dr. Marie Leclerc**: dr.leclerc@hospital.com / doctor123
- **Dr. Paul Martin**: dr.martin@hospital.com / doctor123
- **Dr. Sophie Bernard**: dr.bernard@hospital.com / doctor123

## 📁 Structure du Projet

```
curatime/
├── PPG-main/                 # Backend Django
│   ├── PPG/                  # Configuration Django
│   ├── reservations/         # App principale
│   │   ├── models.py         # Modèles de données
│   │   ├── views.py          # Vues API
│   │   ├── serializers.py    # Sérialiseurs DRF
│   │   └── urls.py           # URLs API
│   ├── manage.py
│   └── requirements.txt
│
├── curatime-frontend/        # Frontend React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   ├── services/        # Services API
│   │   ├── contexts/        # Contextes React
│   │   ├── types/           # Types TypeScript
│   │   └── hooks/           # Hooks personnalisés
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔧 API Endpoints Principaux

### Authentification
- `POST /api/client/login/` - Connexion patient
- `POST /api/doctor/login/` - Connexion médecin
- `POST /api/register/` - Inscription

### Médecins
- `GET /api/doctors/` - Liste des médecins
- `GET /api/doctors/{id}/` - Détail d'un médecin
- `GET /api/specialties/` - Liste des spécialités

### Rendez-vous
- `POST /api/appointments/` - Créer un rendez-vous
- `GET /api/appointments/list/` - Liste des rendez-vous client
- `PATCH /api/appointments/update/{id}/` - Modifier un rendez-vous
- `DELETE /api/appointments/{id}/delete/` - Supprimer un rendez-vous

## 🎨 Fonctionnalités UX/UI

- **Design Responsive** adapté mobile et desktop
- **Interface Intuitive** avec navigation claire
- **Feedback Visuel** avec loading states et notifications
- **Validation de Formulaires** en temps réel
- **Gestion d'Erreurs** avec messages explicites
- **Thème Professionnel** adapté au secteur médical

## 🔒 Sécurité

- **Authentification JWT** avec tokens sécurisés
- **Validation des Données** côté client et serveur
- **Protection CORS** configurée
- **Hashage des Mots de Passe** avec Django
- **Routes Protégées** selon les rôles utilisateur

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les écrans :
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Déploiement

### Production
1. Configurer les variables d'environnement
2. Utiliser une base de données PostgreSQL en production
3. Configurer un serveur web (Nginx + Gunicorn)
4. Utiliser HTTPS pour la sécurité
5. Optimiser les assets React pour la production

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Votre Nom**
- GitHub: [@votre-username](https://github.com/votre-username)
- Email: votre.email@example.com

## 🙏 Remerciements

- Django REST Framework pour l'API robuste
- React Team pour l'excellent framework frontend
- PostgreSQL pour la base de données fiable
- Toute la communauté open source

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous a aidé !**
>>>>>>> 60e586558c091ddc32588d03109d32b3ac1530ea
