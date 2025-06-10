from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from bson import ObjectId
import re
import unicodedata

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls,
        _core_schema: Any,
        _handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        return {"type": "string"}

def generate_slug(text: str) -> str:
    """Génère un slug à partir d'un texte"""
    # Normaliser le texte (enlever les accents)
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('ASCII')
    # Convertir en minuscules
    text = text.lower()
    # Remplacer les espaces et caractères spéciaux par des tirets
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Enlever les tirets au début et à la fin
    text = text.strip('-')
    return text

class CourseCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True

class CourseCategoryCreate(CourseCategoryBase):
    slug: Optional[str] = None

    def __init__(self, **data):
        super().__init__(**data)
        if not self.slug:
            self.slug = generate_slug(self.name)

class CourseCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    slug: Optional[str] = None
    is_active: Optional[bool] = None

class CourseCategoryInDB(CourseCategoryBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    slug: str
    course_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Développement Web",
                "description": "Formations sur les technologies web modernes",
                "slug": "developpement-web",
                "is_active": True,
                "course_count": 0,
                "created_at": "2024-01-15T10:00:00",
                "updated_at": "2024-01-15T10:00:00"
            }
        } 