from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.course_category import CourseCategoryCreate, CourseCategoryUpdate, CourseCategoryInDB
from app.api.deps import get_current_admin_user
from app.models.user import User
from app.db.database import get_database
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=CourseCategoryInDB)
async def create_category(
    category: CourseCategoryCreate,
    current_user: User = Depends(get_current_admin_user)
):
    """Créer une nouvelle catégorie de formation"""
    db = await get_database()
    existing_category = await db.course_categories.find_one({"slug": category.slug})
    if existing_category:
        raise HTTPException(
            status_code=400,
            detail="Une catégorie avec ce slug existe déjà"
        )
    
    category_dict = category.dict()
    category_dict["created_at"] = datetime.utcnow()
    category_dict["updated_at"] = datetime.utcnow()
    category_dict["course_count"] = 0
    
    result = await db.course_categories.insert_one(category_dict)
    created_category = await db.course_categories.find_one({"_id": result.inserted_id})
    return CourseCategoryInDB(**created_category)

@router.get("/", response_model=List[CourseCategoryInDB])
async def read_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = False
):
    """Récupérer la liste des catégories de formation"""
    db = await get_database()
    query = {"is_active": True} if active_only else {}
    cursor = db.course_categories.find(query).skip(skip).limit(limit)
    categories = await cursor.to_list(length=limit)
    return [CourseCategoryInDB(**category) for category in categories]

@router.get("/{category_id}", response_model=CourseCategoryInDB)
async def read_category(category_id: str):
    """Récupérer une catégorie de formation par son ID"""
    db = await get_database()
    category = await db.course_categories.find_one({"_id": ObjectId(category_id)})
    if not category:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return CourseCategoryInDB(**category)

@router.get("/slug/{slug}", response_model=CourseCategoryInDB)
async def read_category_by_slug(slug: str):
    """Récupérer une catégorie de formation par son slug"""
    db = await get_database()
    category = await db.course_categories.find_one({"slug": slug})
    if not category:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return CourseCategoryInDB(**category)

@router.put("/{category_id}", response_model=CourseCategoryInDB)
async def update_category(
    category_id: str,
    category_update: CourseCategoryUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """Mettre à jour une catégorie de formation"""
    db = await get_database()
    category = await db.course_categories.find_one({"_id": ObjectId(category_id)})
    if not category:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    
    if category_update.slug:
        existing_category = await db.course_categories.find_one({"slug": category_update.slug})
        if existing_category and str(existing_category["_id"]) != category_id:
            raise HTTPException(
                status_code=400,
                detail="Une catégorie avec ce slug existe déjà"
            )
    
    update_data = {
        k: v for k, v in category_update.dict(exclude_unset=True).items()
    }
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.course_categories.update_one(
            {"_id": ObjectId(category_id)},
            {"$set": update_data}
        )
    
    updated_category = await db.course_categories.find_one({"_id": ObjectId(category_id)})
    return CourseCategoryInDB(**updated_category)

@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Supprimer une catégorie de formation"""
    db = await get_database()
    result = await db.course_categories.delete_one({"_id": ObjectId(category_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return {"message": "Catégorie supprimée avec succès"} 