from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse

from app.models.comment import Comment, CommentCreate, CommentUpdate
from app.services.comment_service import (
    get_comments_by_post_id,
    get_comment_by_id,
    create_comment,
    update_comment,
    delete_comment,
    like_comment
)
from app.api.deps import get_current_user, get_optional_current_user

router = APIRouter()

@router.get("/post/{post_id}", response_model=List[Comment])
async def read_comments(post_id: str):
    """Récupère tous les commentaires d'un article."""
    return await get_comments_by_post_id(post_id)

@router.get("/{comment_id}", response_model=Comment)
async def read_comment(comment_id: str):
    """Récupère un commentaire par son ID."""
    comment = await get_comment_by_id(comment_id)
    if comment is None:
        raise HTTPException(status_code=404, detail="Commentaire non trouvé")
    return comment

@router.post("/", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def create_comment_endpoint(
    comment: CommentCreate,
    current_user = Depends(get_current_user)
):
    """Crée un nouveau commentaire."""
    try:
        # Assurez-vous que l'ID de l'auteur correspond à l'utilisateur connecté
        if comment.author_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="L'ID de l'auteur ne correspond pas à l'utilisateur connecté"
            )
        
        return await create_comment(comment)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{comment_id}", response_model=Comment)
async def update_comment_endpoint(
    comment_id: str,
    comment_update: CommentUpdate,
    current_user = Depends(get_current_user)
):
    """Met à jour un commentaire existant."""
    updated_comment = await update_comment(comment_id, comment_update, current_user.id)
    if updated_comment is None:
        raise HTTPException(status_code=404, detail="Commentaire non trouvé")
    return updated_comment

@router.delete("/{comment_id}", response_model=dict)
async def delete_comment_endpoint(
    comment_id: str,
    current_user = Depends(get_current_user)
):
    """Supprime un commentaire."""
    is_admin = getattr(current_user, "is_admin", False)
    success = await delete_comment(comment_id, current_user.id, is_admin)
    if not success:
        raise HTTPException(status_code=404, detail="Commentaire non trouvé")
    return {"message": "Commentaire supprimé avec succès"}

@router.post("/{comment_id}/like", response_model=Comment)
async def like_comment_endpoint(
    comment_id: str,
    current_user = Depends(get_current_user)
):
    """Ajoute ou retire un like à un commentaire."""
    try:
        return await like_comment(comment_id, current_user.id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
