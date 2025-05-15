from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate)
            ])
        ])
        
    @classmethod
    def validate(cls, v):
        if not v or not ObjectId.is_valid(v):
            if not v:
                # Generate a new ObjectId if empty
                return str(ObjectId())
            raise ValueError("Invalid ObjectId")
        return str(v)

class CommentBase(BaseModel):
    content: str
    author_id: str
    author_name: str
    post_id: str
    parent_id: Optional[str] = None

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    content: Optional[str] = None

class CommentInDB(CommentBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    likes: int = 0
    
    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "_id": "60d21b4967d0d8cd12345678",
                "content": "Super article !",
                "author_id": "60d21b4967d0d8cd87654321",
                "author_name": "John Doe",
                "post_id": "60d21b4967d0d8cd13579246",
                "parent_id": None,
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00",
                "likes": 0
            }
        }

class Comment(CommentInDB):
    replies: Optional[List["Comment"]] = []
