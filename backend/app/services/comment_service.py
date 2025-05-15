from typing import List, Optional
from fastapi import HTTPException
from pymongo import ReturnDocument
from bson import ObjectId
from datetime import datetime

from app.db.mongodb import get_database
from app.models.comment import CommentCreate, CommentUpdate, CommentInDB, Comment

async def get_comments_by_post_id(post_id: str) -> List[Comment]:
    """Récupère tous les commentaires d'un article."""
    db = await get_database()
    
    # Récupérer tous les commentaires de l'article
    comments = await db.comments.find({"post_id": post_id}).to_list(1000)
    
    # Convertir les ObjectIds en strings pour la réponse
    result = []
    comments_dict = {}
    
    # Première passe : créer un dictionnaire de tous les commentaires
    for comment in comments:
        comment["_id"] = str(comment["_id"])
        comment_obj = Comment(**comment)
        comment_obj.replies = []
        comments_dict[comment_obj.id] = comment_obj
        
    # Deuxième passe : organiser les commentaires en arborescence
    for comment_id, comment_obj in list(comments_dict.items()):
        if comment_obj.parent_id:
            # C'est une réponse, l'ajouter au commentaire parent
            if comment_obj.parent_id in comments_dict:
                comments_dict[comment_obj.parent_id].replies.append(comment_obj)
            # Supprimer cette réponse de la liste principale
            if comment_obj.id in comments_dict:
                del comments_dict[comment_obj.id]
    
    # Les commentaires restants sont les commentaires de premier niveau
    for comment_id, comment_obj in comments_dict.items():
        result.append(comment_obj)
    
    return result

async def get_comment_by_id(comment_id: str) -> Optional[CommentInDB]:
    """Récupère un commentaire par son ID."""
    if not ObjectId.is_valid(comment_id):
        raise HTTPException(status_code=400, detail="ID de commentaire invalide")
    
    db = await get_database()
    comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    
    if comment is None:
        return None
    
    # Convertir l'ObjectId en string pour la réponse
    comment["_id"] = str(comment["_id"])
    return CommentInDB(**comment)

async def create_comment(comment: CommentCreate) -> CommentInDB:
    """Crée un nouveau commentaire."""
    db = await get_database()
    
    # Vérifier si l'article existe
    post = await db.blog_posts.find_one({"_id": ObjectId(comment.post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    # Vérifier si le commentaire parent existe (si spécifié)
    if comment.parent_id:
        parent_comment = await db.comments.find_one({"_id": ObjectId(comment.parent_id)})
        if not parent_comment:
            raise HTTPException(status_code=404, detail="Commentaire parent non trouvé")
    
    # Créer le nouveau commentaire
    new_comment_dict = comment.dict()
    new_comment_dict.update({
        "_id": ObjectId(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "likes": 0
    })
    
    # Insérer dans la base de données
    await db.comments.insert_one(new_comment_dict)
    
    # Récupérer le commentaire créé
    created_comment_dict = await db.comments.find_one({"_id": new_comment_dict["_id"]})
    
    # Convertir l'ObjectId en string pour la réponse
    created_comment_dict["_id"] = str(created_comment_dict["_id"])
    
    return CommentInDB(**created_comment_dict)

async def update_comment(comment_id: str, comment_update: CommentUpdate, user_id: str) -> Optional[CommentInDB]:
    """Met à jour un commentaire existant."""
    if not ObjectId.is_valid(comment_id):
        raise HTTPException(status_code=400, detail="ID de commentaire invalide")
    
    db = await get_database()
    
    # Vérifier si le commentaire existe
    existing_comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    if not existing_comment:
        return None
    
    # Vérifier si l'utilisateur est l'auteur du commentaire
    if existing_comment["author_id"] != user_id:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas autorisé à modifier ce commentaire")
    
    # Préparer les données de mise à jour
    update_data = {k: v for k, v in comment_update.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Mettre à jour le commentaire
    updated_comment = await db.comments.find_one_and_update(
        {"_id": ObjectId(comment_id)},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    
    # Convertir l'ObjectId en string pour la réponse
    updated_comment["_id"] = str(updated_comment["_id"])
    return CommentInDB(**updated_comment)

async def delete_comment(comment_id: str, user_id: str, is_admin: bool = False) -> bool:
    """Supprime un commentaire."""
    if not ObjectId.is_valid(comment_id):
        raise HTTPException(status_code=400, detail="ID de commentaire invalide")
    
    db = await get_database()
    
    # Vérifier si le commentaire existe
    existing_comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    if not existing_comment:
        return False
    
    # Vérifier si l'utilisateur est l'auteur du commentaire ou un administrateur
    if not is_admin and existing_comment["author_id"] != user_id:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas autorisé à supprimer ce commentaire")
    
    # Supprimer le commentaire
    result = await db.comments.delete_one({"_id": ObjectId(comment_id)})
    
    # Supprimer également toutes les réponses à ce commentaire
    await db.comments.delete_many({"parent_id": comment_id})
    
    return result.deleted_count > 0

async def like_comment(comment_id: str, user_id: str) -> CommentInDB:
    """Ajoute un like à un commentaire."""
    if not ObjectId.is_valid(comment_id):
        raise HTTPException(status_code=400, detail="ID de commentaire invalide")
    
    db = await get_database()
    
    # Vérifier si le commentaire existe
    existing_comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    if not existing_comment:
        raise HTTPException(status_code=404, detail="Commentaire non trouvé")
    
    # Vérifier si l'utilisateur a déjà liké ce commentaire
    existing_like = await db.comment_likes.find_one({
        "comment_id": comment_id,
        "user_id": user_id
    })
    
    if existing_like:
        # L'utilisateur a déjà liké ce commentaire, on retire son like
        await db.comment_likes.delete_one({"_id": existing_like["_id"]})
        updated_comment = await db.comments.find_one_and_update(
            {"_id": ObjectId(comment_id)},
            {"$inc": {"likes": -1}},
            return_document=ReturnDocument.AFTER
        )
    else:
        # L'utilisateur n'a pas encore liké ce commentaire
        await db.comment_likes.insert_one({
            "comment_id": comment_id,
            "user_id": user_id,
            "created_at": datetime.utcnow()
        })
        updated_comment = await db.comments.find_one_and_update(
            {"_id": ObjectId(comment_id)},
            {"$inc": {"likes": 1}},
            return_document=ReturnDocument.AFTER
        )
    
    # Convertir l'ObjectId en string pour la réponse
    updated_comment["_id"] = str(updated_comment["_id"])
    return CommentInDB(**updated_comment)
