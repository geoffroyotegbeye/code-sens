# Code&Sens - Plateforme de Formation en Ligne

Code&Sens est une plateforme éducative proposant des formations et du mentorat dans le domaine du développement web et de la technologie.

## Structure du Projet

Le projet est divisé en deux parties principales :

- **Frontend** : Application React avec TypeScript et Tailwind CSS
- **Backend** : API FastAPI avec MongoDB

## Prérequis

- Node.js (v16+)
- Python (v3.8+)
- MongoDB

## Installation

### Backend

1. Accédez au dossier backend :
```
cd backend
```

2. Créez un environnement virtuel Python :
```
python -m venv venv
```

3. Activez l'environnement virtuel :
   - Windows : `venv\Scripts\activate`
   - Linux/Mac : `source venv/bin/activate`

4. Installez les dépendances :
```
pip install -r requirements.txt
```

5. Configurez les variables d'environnement dans le fichier `.env` :
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=codesens
SECRET_KEY=votre_cle_secrete
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

6. Démarrez le serveur :
```
python run.py
```

Le serveur backend sera accessible à l'adresse : http://localhost:8000

### Frontend

1. Accédez au dossier frontend :
```
cd frontend
```

2. Installez les dépendances :
```
npm install
```

3. Démarrez le serveur de développement :
```
npm run dev
```

L'application frontend sera accessible à l'adresse : http://localhost:5173

## Fonctionnalités

- **Authentification** : Inscription, connexion et gestion des sessions utilisateur
- **Catalogue de formations** : Parcourir et s'inscrire à des formations
- **Mentorat** : Réserver des sessions de mentorat personnalisé
- **Blog** : Articles et ressources éducatives
- **Administration** : Gestion des cours, utilisateurs et contenus (pour les administrateurs)

## Technologies Utilisées

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- React Hot Toast (notifications)

### Backend
- FastAPI
- MongoDB (avec Motor)
- JWT pour l'authentification
- Pydantic pour la validation des données

## API Endpoints

### Authentification
- `POST /api/v1/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/v1/auth/login` - Connexion utilisateur
- `GET /api/v1/auth/me` - Récupérer les informations de l'utilisateur connecté

## Développement

Pour plus d'informations sur le développement et la contribution au projet, consultez la documentation dans les dossiers respectifs du frontend et du backend.
