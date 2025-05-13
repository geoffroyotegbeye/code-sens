from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .user import PyObjectId, UserInDB
from bson import ObjectId

class BlogPostBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: str
    cover_image: Optional[str] = None
    author_id: str
    category: str
    tags: List[str] = []
    
class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

class BlogPostInDB(BlogPostBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    published_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "_id": "123456789012345678901234",
                "title": "Introduction à React",
                "slug": "introduction-a-react",
                "content": "Contenu de l'article...",
                "excerpt": "Un aperçu de l'article...",
                "cover_image": "https://example.com/image.jpg",
                "author_id": "123456789012345678901234",
                "category": "Frontend",
                "tags": ["React", "JavaScript", "Web"],
                "published_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        }
    }

class BlogPostWithAuthor(BlogPostInDB):
    author: dict
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class BlogComment(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    content: str
    author_id: str
    post_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }
