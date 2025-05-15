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

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None

class CategoryInDB(CategoryBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "_id": "60d21b4967d0d8cd12345678",
                "name": "Frontend",
                "slug": "frontend",
                "description": "Articles sur le développement frontend",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        }

class Category(CategoryInDB):
    pass
