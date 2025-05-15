from typing import Dict
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse

from app.services.like_service import (
    toggle_post_like,
    get_post_likes_count,
    check_user_liked_post
)
from app.api.deps import get_current_user, get_optional_current_user

router = APIRouter()

@router.post("/post/{post_id}", response_model=Dict[str, int])
async def toggle_like_post(
    post_id: str,
    current_user = Depends(get_current_user)
):
    """Ajoute ou retire un like à un article."""
    try:
        return await toggle_post_like(post_id, current_user.id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/post/{post_id}/count", response_model=Dict[str, int])
async def get_post_likes_count_endpoint(
    post_id: str,
    current_user = Depends(get_optional_current_user)
):
    """Récupère le nombre de likes d'un article."""
    try:
        likes_count = await get_post_likes_count(post_id)
        
        # Vérifier si l'utilisateur a liké cet article (si connecté)
        liked_by_user = False
        if current_user:
            liked_by_user = await check_user_liked_post(post_id, current_user.id)
        
        return {
            "likes_count": likes_count,
            "liked_by_user": liked_by_user
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
