from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse

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

router = APIRouter()

@router.get("/", response_model=List[Category])
async def read_categories():
    """Récupère toutes les catégories."""
    return await get_all_categories()

@router.get("/{category_id}", response_model=Category)
async def read_category(category_id: str):
    """Récupère une catégorie par son ID."""
    category = await get_category_by_id(category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return category

@router.get("/slug/{slug}", response_model=Category)
async def read_category_by_slug(slug: str):
    """Récupère une catégorie par son slug."""
    category = await get_category_by_slug(slug)
    if category is None:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return category

@router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)
async def create_category_endpoint(
    category: CategoryCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Crée une nouvelle catégorie. Réservé aux administrateurs."""
    try:
        return await create_category(category)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{category_id}", response_model=Category)
async def update_category_endpoint(
    category_id: str,
    category_update: CategoryUpdate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Met à jour une catégorie existante. Réservé aux administrateurs."""
    updated_category = await update_category(category_id, category_update)
    if updated_category is None:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return updated_category

@router.delete("/{category_id}", response_model=bool)
async def delete_category_endpoint(
    category_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Supprime une catégorie. Réservé aux administrateurs."""
    try:
        success = await delete_category(category_id)
        if not success:
            raise HTTPException(status_code=404, detail="Catégorie non trouvée")
        return JSONResponse(content={"success": True})
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
