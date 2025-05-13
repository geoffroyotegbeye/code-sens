import os
import shutil
from fastapi import UploadFile
from datetime import datetime
import uuid
from pathlib import Path
from ..core.config import settings

# Définir le répertoire de stockage des images
UPLOAD_DIR = Path("static/uploads")

# Créer le répertoire s'il n'existe pas
os.makedirs(UPLOAD_DIR, exist_ok=True)

# URL de base du serveur
BASE_URL = settings.BACKEND_HOST or "http://localhost:8000"

async def save_upload_file(file: UploadFile) -> str:
    """
    Sauvegarde un fichier téléchargé et retourne son URL complète
    """
    # Générer un nom de fichier unique
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    
    # Créer un nom de fichier sécurisé
    filename = f"{timestamp}_{unique_id}{file_extension}"
    file_path = UPLOAD_DIR / filename
    
    # Sauvegarder le fichier
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Retourner l'URL relative (plus compatible avec certaines configurations)
    relative_path = f"/static/uploads/{filename}"
    
    # Afficher les deux chemins pour le débogage
    print(f"Chemin relatif: {relative_path}")
    print(f"Chemin complet: {BASE_URL}{relative_path}")
    
    return relative_path
