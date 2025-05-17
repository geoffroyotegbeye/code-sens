from bson import ObjectId
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..db.database import get_database
from ..models.blog import BlogPostCreate, BlogPostInDB, BlogPostUpdate, BlogPostWithAuthor
from ..services.user_service import get_user_by_id
from ..services.upload_service import delete_unused_images, extract_image_urls_from_content, delete_file

async def get_all_blog_posts(skip: int = 0, limit: int = 10, category: str = None) -> List[BlogPostWithAuthor]:
    db = await get_database()
    query = {}
    if category:
        query["category"] = category
        
    cursor = db.blog_posts.find(query).sort("published_at", -1).skip(skip).limit(limit)
    posts = []
    
    async for post in cursor:
        # Convertir l'ObjectId en string
        post["_id"] = str(post["_id"])
        
        # Récupérer l'auteur
        author = await get_user_by_id(post["author_id"])
        author_dict = None
        if author:
            author_dict = {
                "id": str(author.id),
                "full_name": author.full_name,
                "email": author.email,
                "role": author.role
            }
        
        # Créer un post avec l'auteur
        post_with_author = {**post, "author": author_dict}
        posts.append(BlogPostWithAuthor(**post_with_author))
    
    return posts

async def get_blog_post_by_slug(slug: str) -> Optional[BlogPostWithAuthor]:
    db = await get_database()
    post = await db.blog_posts.find_one({"slug": slug})
    
    if not post:
        return None
    
    # Convertir l'ObjectId en string
    post["_id"] = str(post["_id"])
    
    # Récupérer l'auteur
    author = await get_user_by_id(post["author_id"])
    author_dict = None
    if author:
        author_dict = {
            "id": str(author.id),
            "full_name": author.full_name,
            "email": author.email,
            "role": author.role
        }
    
    # Créer un post avec l'auteur
    post_with_author = {**post, "author": author_dict}
    return BlogPostWithAuthor(**post_with_author)

async def create_blog_post(post: BlogPostCreate) -> BlogPostInDB:
    db = await get_database()
    
    # Créer un nouveau post
    post_in_db = BlogPostInDB(
        **post.model_dump(),
        published_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    # Insérer le post dans la base de données
    post_dict = post_in_db.model_dump(by_alias=True)
    # Convertir l'id string en ObjectId pour MongoDB
    if "_id" in post_dict and isinstance(post_dict["_id"], str):
        post_dict["_id"] = ObjectId(post_dict["_id"])
        
    result = await db.blog_posts.insert_one(post_dict)
    
    # Récupérer le post créé
    created_post = await db.blog_posts.find_one({"_id": result.inserted_id})
    created_post["_id"] = str(created_post["_id"])
    
    return BlogPostInDB(**created_post)

async def update_blog_post(slug: str, post_update: BlogPostUpdate) -> Optional[BlogPostInDB]:
    db = await get_database()
    
    # Vérifier si le post existe
    existing_post = await db.blog_posts.find_one({"slug": slug})
    if not existing_post:
        return None
    
    # Préparer les données à mettre à jour
    update_data = post_update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # Si le contenu a été modifié, supprimer les images qui ne sont plus utilisées
    if "content" in update_data:
        old_content = existing_post.get("content", "")
        new_content = update_data["content"]
        deleted_images = await delete_unused_images(old_content, new_content)
        if deleted_images:
            print(f"Images supprimées lors de la mise à jour de l'article {slug}: {deleted_images}")
    
    # Si l'image de couverture a été modifiée, supprimer l'ancienne image
    if "cover_image" in update_data and existing_post.get("cover_image") != update_data["cover_image"]:
        old_cover_image = existing_post.get("cover_image")
        if old_cover_image and old_cover_image.startswith("/static/uploads/"):
            success = await delete_file(old_cover_image)
            if success:
                print(f"Image de couverture supprimée: {old_cover_image}")
    
    # Mettre à jour le post
    await db.blog_posts.update_one(
        {"slug": slug},
        {"$set": update_data}
    )
    
    # Vérifier si la mise à jour a réussi
    if "slug" in update_data and update_data["slug"] != slug:
        # Si le slug a été modifié, chercher avec le nouveau slug
        updated_post = await db.blog_posts.find_one({"slug": update_data["slug"]})
    else:
        updated_post = await db.blog_posts.find_one({"slug": slug})
    
    if not updated_post:
        return None
    
    # Récupérer le post mis à jour
    updated_post["_id"] = str(updated_post["_id"])
    
    return BlogPostInDB(**updated_post)

async def delete_blog_post(slug: str) -> bool:
    db = await get_database()
    
    # Récupérer le post avant de le supprimer pour obtenir les URLs des images
    post = await db.blog_posts.find_one({"slug": slug})
    if not post:
        return False
    
    # Supprimer le post
    result = await db.blog_posts.delete_one({"slug": slug})
    
    if result.deleted_count > 0:
        # Supprimer l'image de couverture si elle existe
        cover_image = post.get("cover_image")
        if cover_image and cover_image.startswith("/static/uploads/"):
            await delete_file(cover_image)
            print(f"Image de couverture supprimée: {cover_image}")
        
        # Extraire et supprimer toutes les images du contenu
        content = post.get("content", "")
        image_urls = extract_image_urls_from_content(content)
        
        for url in image_urls:
            success = await delete_file(url)
            if success:
                print(f"Image supprimée du contenu: {url}")
        
        return True
    
    return False

async def get_blog_categories() -> List[str]:
    db = await get_database()
    categories = await db.blog_posts.distinct("category")
    return categories
