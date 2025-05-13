from datetime import datetime
from typing import Optional, Any, Literal
from pydantic import BaseModel, Field, EmailStr, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
        
    @classmethod
    def validate(cls, v, handler=None):
        # Ignorer le paramètre handler qui est passé par Pydantic v2
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)
        
    @classmethod
    def __get_pydantic_json_schema__(cls, schema_generator: GetJsonSchemaHandler) -> JsonSchemaValue:
        return schema_generator.get_schema_for_type(str)

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_admin: bool = False
    role: str = "user"  # Valeurs possibles: "user", "admin"

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
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
        }
    }

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "from_attributes": True,
        "json_encoders": {ObjectId: str}
    }
