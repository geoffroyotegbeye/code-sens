from typing import List, Optional
from fastapi import HTTPException
from pymongo import ReturnDocument
from bson import ObjectId
from datetime import datetime

from app.db.mongodb import get_database
from app.models.category import CategoryCreate, CategoryUpdate, CategoryInDB

async def get_all_categories() -> List[CategoryInDB]:
    """Récupère toutes les catégories de la base de données."""
    db = await get_database()
    categories_raw = await db.categories.find().to_list(1000)
    
    # Convertir les ObjectIds en strings pour la réponse
    categories = []
    for cat in categories_raw:
        cat["_id"] = str(cat["_id"])
        categories.append(CategoryInDB(**cat))
    
    return categories

async def get_category_by_id(category_id: str) -> Optional[CategoryInDB]:
    """Récupère une catégorie par son ID."""
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="ID de catégorie invalide")
    
    db = await get_database()
    category = await db.categories.find_one({"_id": ObjectId(category_id)})
    
    if category is None:
        return None
    
    # Convertir l'ObjectId en string pour la réponse
    category["_id"] = str(category["_id"])
    return CategoryInDB(**category)

async def get_category_by_slug(slug: str) -> Optional[CategoryInDB]:
    """Récupère une catégorie par son slug."""
    db = await get_database()
    category = await db.categories.find_one({"slug": slug})
    
    if category is None:
        return None
    
    # Convertir l'ObjectId en string pour la réponse
    category["_id"] = str(category["_id"])
    return CategoryInDB(**category)

async def create_category(category: CategoryCreate) -> CategoryInDB:
    """Crée une nouvelle catégorie."""
    db = await get_database()
    
    # Vérifier si une catégorie avec le même slug existe déjà
    existing_category = await db.categories.find_one({"slug": category.slug})
    if existing_category:
        raise HTTPException(status_code=400, detail="Une catégorie avec ce slug existe déjà")
    
    # Créer la nouvelle catégorie avec un nouvel ObjectId
    new_category_dict = category.dict()
    new_category_dict.update({
        "_id": ObjectId(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # Insérer dans la base de données
    await db.categories.insert_one(new_category_dict)
    
    # Récupérer la catégorie créée et la convertir en modèle Pydantic
    created_category_dict = await db.categories.find_one({"_id": new_category_dict["_id"]})
    
    # Convertir l'ObjectId en string pour la réponse
    created_category_dict["_id"] = str(created_category_dict["_id"])
    
    return CategoryInDB(**created_category_dict)

async def update_category(category_id: str, category_update: CategoryUpdate) -> Optional[CategoryInDB]:
    """Met à jour une catégorie existante."""
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="ID de catégorie invalide")
    
    db = await get_database()
    
    # Vérifier si la catégorie existe
    existing_category = await db.categories.find_one({"_id": ObjectId(category_id)})
    if not existing_category:
        return None
    
    # Si le slug est mis à jour, vérifier qu'il n'existe pas déjà
    if category_update.slug and category_update.slug != existing_category["slug"]:
        slug_exists = await db.categories.find_one({"slug": category_update.slug, "_id": {"$ne": ObjectId(category_id)}})
        if slug_exists:
            raise HTTPException(status_code=400, detail="Une catégorie avec ce slug existe déjà")
    
    # Préparer les données de mise à jour
    update_data = {k: v for k, v in category_update.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Mettre à jour la catégorie
    updated_category = await db.categories.find_one_and_update(
        {"_id": ObjectId(category_id)},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    
    # Convertir l'ObjectId en string pour la réponse
    updated_category["_id"] = str(updated_category["_id"])
    return CategoryInDB(**updated_category)

async def delete_category(category_id: str) -> bool:
    """Supprime une catégorie."""
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="ID de catégorie invalide")
    
    db = await get_database()
    
    # Vérifier si la catégorie existe
    existing_category = await db.categories.find_one({"_id": ObjectId(category_id)})
    if not existing_category:
        return False
    
    # Vérifier si la catégorie est utilisée dans des articles
    blog_posts_with_category = await db.blog_posts.find_one({"category": existing_category["name"]})
    if blog_posts_with_category:
        raise HTTPException(
            status_code=400, 
            detail="Cette catégorie ne peut pas être supprimée car elle est utilisée dans des articles"
        )
    
    # Supprimer la catégorie
    result = await db.categories.delete_one({"_id": ObjectId(category_id)})
    
    return result.deleted_count > 0
