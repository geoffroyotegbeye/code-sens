from datetime import datetime
from typing import Optional, Any, Literal
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId

# Importer la nouvelle implémentation de PyObjectId
from ..utils.object_id_handler import PyObjectId

class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True
    is_admin: bool = False
    full_name: Optional[str] = None
    role: str = "user"  # Par défaut, l'utilisateur a le rôle "user"

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: PyObjectId = Field(alias="_id")
    hashed_password: str
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "_id": "123456789012345678901234",
                "email": "user@example.com",
                "full_name": "John Doe",
                "is_admin": False,
                "role": "user",
                "hashed_password": "hashedpassword",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        },
        "json_encoders": {
            PyObjectId: str
        }
    }

class User(UserBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True,
        "populate_by_name": True,
        "json_encoders": {ObjectId: str}
    }
