from bson import ObjectId
from typing import List, Optional
from datetime import datetime
from ..db.database import get_database
from ..models.blog import BlogPostCreate, BlogPostInDB, BlogPostUpdate, BlogPostWithAuthor
from ..services.user_service import get_user_by_id

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
    
    # Filtrer les champs non nuls
    update_data = {k: v for k, v in post_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Mettre à jour le post
    result = await db.blog_posts.update_one(
        {"slug": slug},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        return None
    
    # Récupérer le post mis à jour
    updated_post = await db.blog_posts.find_one({"slug": slug})
    updated_post["_id"] = str(updated_post["_id"])
    
    return BlogPostInDB(**updated_post)

async def delete_blog_post(slug: str) -> bool:
    db = await get_database()
    result = await db.blog_posts.delete_one({"slug": slug})
    return result.deleted_count > 0

async def get_blog_categories() -> List[str]:
    db = await get_database()
    categories = await db.blog_posts.distinct("category")
    return categories
