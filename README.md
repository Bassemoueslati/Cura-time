# CuraTime — Plateforme de gestion de rendez‑vous médicaux

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript) ![Django](https://img.shields.io/badge/Django-4.x-092E20?logo=django)

## 📋 Description

CuraTime connecte les patients avec des médecins et permet la gestion complète des rendez‑vous. L’application inclut un portail patient, un espace médecin, et un panneau d’administration.

## ✨ Fonctionnalités

### Patients
- **Inscription/Connexion** (JWT)
- **Recherche de médecins** par spécialité
- **Prise et gestion de rendez‑vous**
- **Tableau de bord** et **profil**

### Médecins
- **Connexion professionnelle**
- **Gestion du profil** (coordonnées, bio, tarif)
- **Gestion des disponibilités via popup** avec sélection date/heure + éditeur JSON
- **Liste des rendez‑vous**

### Administration
- **Gestion des médecins** et **spécialités**
- **Suivi des rendez‑vous** et **statistiques**

## 🗂️ Structure du projet

```
c:\Users\Bassem\Downloads\PFE-LY
├─ backend/                 # Django + DRF
│  ├─ PPG/                  # settings/urls
│  └─ reservations/         # app principale (modèles, vues, serializers)
└─ frontend/                # React + TypeScript
   ├─ src/components/
   ├─ src/pages/
   ├─ src/services/
   └─ public/
```

## 🛠️ Installation (local)

### Prérequis
- Node.js 18+ et npm
- Python 3.10+

### 1) Backend (Django)
```bash
# Depuis c:\Users\Bassem\Downloads\PFE-LY\backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Démarre sur http://localhost:8000

### 2) Frontend (React)
```bash
# Depuis c:\Users\Bassem\Downloads\PFE-LY\frontend
npm install
npm start
```
Démarre sur http://localhost:3000

## 🔌 API principales
- POST `/api/client/login/`, `/api/doctor/login/`, `/api/admin/login/`
- GET `/api/doctors/`, `/api/doctors/{id}/`
- GET `/api/specialties/`
- POST `/api/appointments/` (patient)
- GET `/api/appointments/list/` (patient)
- PATCH `/api/appointments/update/{id}/`
- DELETE `/api/appointments/{id}/delete/`
- POST `/api/support/contact/`
- GET/PATCH `/api/doctors/me/` (médecin — inclut `availability`)

## 📅 Disponibilités médecin — Popup + JSON

Dans la page Médecin: Mon Profil (`/doctor/profile`) :
1. Cliquez sur **Gérer les disponibilités**.
2. Dans le popup, ajoutez une **date** et une **heure**, puis **Ajouter**.
3. À droite, un éditeur **JSON** permet d’éditer/coller un format structuré.
4. Boutons:
   - **Charger JSON**: applique le JSON vers la liste
   - **Mettre à jour JSON**: génère le JSON depuis la liste
   - **Fermer**: ferme le popup

Formats acceptés par `/api/doctors/me/` (PATCH `availability`):
```json
{
  "availability": {
    "2025-08-25": ["09:00", "10:30"],
    "2025-08-26": ["14:00"]
  }
}
```
Ou bien:
```json
{
  "availability": [
    { "date": "2025-08-25", "times": ["09:00", "10:30"] },
    { "date": "2025-08-26", "times": ["14:00"] }
  ]
}
```

## 🎨 UI — Pied de page
- Suppression des sections: **Liens rapides** et **Support**.
- Icônes **Facebook**, **Twitter**, **LinkedIn** rendues en **icônes statiques** (pas de lien).

## 🔒 Sécurité
- Authentification **JWT**
- Permissions par rôle (patient/médecin/admin)
- Validation serveur via DRF

## 🤝 Contribution
- Branches feature, PR, revue de code.

---

Besoin d’aide pour intégrer un calendrier plus avancé (hebdo/journalier) ? Voir Documentation complète pour les options et l’API d’`availability`. 