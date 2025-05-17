import os
import shutil
import re
from fastapi import UploadFile
from datetime import datetime
import uuid
from pathlib import Path
from typing import List, Set
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


def extract_image_urls_from_content(content: str) -> Set[str]:
    """
    Extrait toutes les URLs d'images du contenu d'un article de blog
    """
    # Recherche des URLs d'images dans le contenu HTML
    # Cela capture les images dans les balises <img src="..."> et les styles background-image: url('...')
    img_pattern = r'<img[^>]*src=["\']([^"\']*)["\']'
    bg_pattern = r'background-image:\s*url\(["\']?([^\)"\']*)'
    
    # Trouver toutes les correspondances
    img_urls = set(re.findall(img_pattern, content))
    bg_urls = set(re.findall(bg_pattern, content))
    
    # Combiner les résultats
    all_urls = img_urls.union(bg_urls)
    
    # Filtrer pour ne garder que les URLs d'images uploadées (celles qui commencent par /static/uploads/)
    uploaded_urls = {url for url in all_urls if url.startswith('/static/uploads/')}
    
    return uploaded_urls


async def delete_file(file_url: str) -> bool:
    """
    Supprime un fichier du serveur à partir de son URL relative
    """
    if not file_url or not file_url.startswith('/static/uploads/'):
        print(f"URL invalide: {file_url}")
        return False
    
    # Extraire le nom du fichier de l'URL
    filename = file_url.split('/')[-1]
    file_path = UPLOAD_DIR / filename
    
    # Vérifier si le fichier existe
    if not os.path.exists(file_path):
        print(f"Fichier non trouvé: {file_path}")
        return False
    
    try:
        # Supprimer le fichier
        os.remove(file_path)
        print(f"Fichier supprimé: {file_path}")
        return True
    except Exception as e:
        print(f"Erreur lors de la suppression du fichier {file_path}: {e}")
        return False


async def delete_unused_images(old_content: str, new_content: str) -> List[str]:
    """
    Supprime les images qui étaient dans l'ancien contenu mais pas dans le nouveau
    Retourne la liste des URLs des images supprimées
    """
    # Extraire les URLs d'images des deux contenus
    old_urls = extract_image_urls_from_content(old_content)
    new_urls = extract_image_urls_from_content(new_content)
    
    # Trouver les URLs qui sont dans l'ancien contenu mais pas dans le nouveau
    urls_to_delete = old_urls - new_urls
    
    # Supprimer les fichiers correspondants
    deleted_urls = []
    for url in urls_to_delete:
        success = await delete_file(url)
        if success:
            deleted_urls.append(url)
    
    return deleted_urls
