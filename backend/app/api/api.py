from fastapi import APIRouter
from .routes import auth, blog, upload, categories, comments, likes, mentoring

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(likes.router, prefix="/likes", tags=["likes"])
api_router.include_router(mentoring.router, prefix="/mentoring", tags=["mentoring"])
