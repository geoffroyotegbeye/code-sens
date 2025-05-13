from fastapi import APIRouter
from .routes import auth, blog, upload

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
