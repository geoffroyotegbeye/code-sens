from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from ...models.blog import BlogPostCreate, BlogPostInDB, BlogPostUpdate, BlogPostWithAuthor
from ...services.blog_service import (
    get_all_blog_posts, 
    get_blog_post_by_slug, 
    create_blog_post, 
    update_blog_post, 
    delete_blog_post,
    get_blog_categories
)
from ...api.deps import get_current_user, get_optional_current_user
from ...models.user import UserInDB
from typing import Dict, Any

router = APIRouter()

@router.get("/", response_model=List[BlogPostWithAuthor])
async def read_blog_posts(
    skip: int = 0, 
    limit: int = 10,
    category: Optional[str] = None
):
    """
    Récupérer tous les articles de blog avec pagination et filtrage par catégorie.
    """
    return await get_all_blog_posts(skip=skip, limit=limit, category=category)

@router.get("/categories", response_model=List[str])
async def read_blog_categories():
    """
    Récupérer toutes les catégories d'articles.
    """
    return await get_blog_categories()

@router.get("/{slug}", response_model=BlogPostWithAuthor)
async def read_blog_post(slug: str):
    """
    Récupérer un article de blog par son slug.
    """
    post = await get_blog_post_by_slug(slug)
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return post

@router.post("/", response_model=BlogPostInDB)
async def create_post(
    post: BlogPostCreate,
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    """
    Créer un nouvel article de blog.
    """
    # Déboguer les informations d'authentification
    print(f"Utilisateur authentifié: {current_user is not None}")
    if current_user:
        print(f"ID de l'utilisateur: {current_user.id}")
        print(f"Rôle de l'utilisateur: {getattr(current_user, 'role', 'non défini')}")
        print(f"Admin: {getattr(current_user, 'is_admin', False)}")
    
    # Pour le développement, permettre la création d'articles sans vérification stricte des permissions
    # Dans un environnement de production, vous voudriez décommenter ces lignes
    # if current_user:
    #     is_admin = getattr(current_user, 'is_admin', False)
    #     role = getattr(current_user, 'role', '')
    #     if not is_admin and role != 'admin':
    #         raise HTTPException(
    #             status_code=403,
    #             detail="Vous n'avez pas les permissions nécessaires pour créer un article"
    #         )
    
    # Utiliser les données de l'article fournies dans la requête
    post_data = post.model_dump()
    
    # Déboguer les données de l'article
    print(f"Données de l'article avant création: {post_data}")
    
    # Créer l'article
    try:
        # Créer une copie des données pour éviter de modifier l'original
        post_dict = dict(post_data)
        
        # Si l'ID de l'auteur n'est pas spécifié, utiliser un ID par défaut ou celui de l'utilisateur actuel
        if not post_dict.get("author_id"):
            if current_user:
                post_dict["author_id"] = str(current_user.id)
            else:
                # Utiliser un ID d'auteur par défaut pour le développement
                post_dict["author_id"] = "000000000000000000000000"  # ID factice pour le développement
        
        print(f"Données finales de l'article: {post_dict}")
        
        # Créer l'article dans la base de données
        created_post = await create_blog_post(BlogPostCreate(**post_dict))
        return created_post
    except Exception as e:
        print(f"Erreur lors de la création de l'article: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création de l'article: {str(e)}")

@router.put("/{slug}", response_model=BlogPostInDB)
async def update_post(
    slug: str,
    post_update: BlogPostUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Mettre à jour un article de blog.
    """
    # Vérifier si l'article existe
    post = await get_blog_post_by_slug(slug)
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    # Vérifier si l'utilisateur est l'auteur ou un admin
    if str(current_user.id) != post.author_id and not current_user.is_admin and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Vous n'avez pas les permissions nécessaires pour modifier cet article"
        )
    
    updated_post = await update_blog_post(slug, post_update)
    if not updated_post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    return updated_post

@router.delete("/{slug}", response_model=bool)
async def delete_post(
    slug: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Supprimer un article de blog.
    """
    # Vérifier si l'article existe
    post = await get_blog_post_by_slug(slug)
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    # Vérifier si l'utilisateur est l'auteur ou un admin
    if str(current_user.id) != post.author_id and not current_user.is_admin and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Vous n'avez pas les permissions nécessaires pour supprimer cet article"
        )
    
    success = await delete_blog_post(slug)
    if not success:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    return True
