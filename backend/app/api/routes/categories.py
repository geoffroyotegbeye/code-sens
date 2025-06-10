from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId

from app.models.category import Category, CategoryCreate, CategoryUpdate
from app.services.category_service import (
    get_all_categories,
    get_category_by_id,
    get_category_by_slug,
    create_category,
    update_category,
    delete_category
)
from app.api.deps import get_current_user, get_current_admin_user
from app.models.user import User
from app.db.database import get_database

router = APIRouter()

@router.get("/", response_model=List[Category])
async def read_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = False
):
    """Récupérer la liste des catégories de blog"""
    return await get_all_categories(skip=skip, limit=limit, active_only=active_only)

@router.get("/{category_id}", response_model=Category)
async def read_category(category_id: str):
    """Récupérer une catégorie de blog par son ID"""
    category = await get_category_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return category

@router.get("/slug/{slug}", response_model=Category)
async def read_category_by_slug(slug: str):
    """Récupérer une catégorie de blog par son slug"""
    category = await get_category_by_slug(slug)
    if not category:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return category

@router.post("/", response_model=Category)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_admin_user)
):
    """Créer une nouvelle catégorie de blog"""
    return await create_category(category)

@router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: str,
    category_update: CategoryUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """Mettre à jour une catégorie de blog"""
    category = await get_category_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return await update_category(category_id, category_update)

@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Supprimer une catégorie de blog"""
    category = await get_category_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    await delete_category(category_id)
    return {"message": "Catégorie supprimée avec succès"}
