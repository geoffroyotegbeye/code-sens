from typing import List, Optional, Dict
from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime

from app.db.mongodb import get_database
from app.models.like import LikeCreate, LikeInDB

async def toggle_post_like(post_id: str, user_id: str) -> Dict[str, int]:
    """
    Ajoute ou supprime un like sur un article.
    Retourne le nombre total de likes après l'opération.
    """
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="ID d'article invalide")
    
    db = await get_database()
    
    # Vérifier si l'article existe
    post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    # Vérifier si l'utilisateur a déjà liké cet article
    existing_like = await db.post_likes.find_one({
        "post_id": post_id,
        "user_id": user_id
    })
    
    if existing_like:
        # L'utilisateur a déjà liké cet article, on retire son like
        await db.post_likes.delete_one({"_id": existing_like["_id"]})
        liked = False
    else:
        # L'utilisateur n'a pas encore liké cet article
        new_like = {
            "_id": ObjectId(),
            "post_id": post_id,
            "user_id": user_id,
            "created_at": datetime.utcnow()
        }
        await db.post_likes.insert_one(new_like)
        liked = True
    
    # Compter le nombre total de likes pour cet article
    total_likes = await db.post_likes.count_documents({"post_id": post_id})
    
    # Mettre à jour le compteur de likes dans l'article
    await db.blog_posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {"likes_count": total_likes}}
    )
    
    return {
        "likes_count": total_likes,
        "liked_by_user": liked
    }

async def get_post_likes_count(post_id: str) -> int:
    """Récupère le nombre de likes d'un article."""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="ID d'article invalide")
    
    db = await get_database()
    
    # Vérifier si l'article existe
    post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    # Compter le nombre de likes
    likes_count = await db.post_likes.count_documents({"post_id": post_id})
    
    return likes_count

async def check_user_liked_post(post_id: str, user_id: str) -> bool:
    """Vérifie si un utilisateur a liké un article."""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="ID d'article invalide")
    
    db = await get_database()
    
    # Vérifier si l'article existe
    post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    # Vérifier si l'utilisateur a liké cet article
    existing_like = await db.post_likes.find_one({
        "post_id": post_id,
        "user_id": user_id
    })
    
    return existing_like is not None
