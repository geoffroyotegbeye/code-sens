from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from bson import ObjectId
from .course_category import PyObjectId, generate_slug

class Lesson(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    duration: int  # en minutes
    type: str = "video"  # video, text, quiz, etc.
    order: int
    video_url: Optional[str] = None  # URL de la vidéo pour les leçons de type video
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}

class Module(BaseModel):
    title: str
    description: Optional[str] = None
    order: int
    lessons: List[Lesson] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}

class CourseBase(BaseModel):
    title: str
    description: str
    category_id: PyObjectId
    price: float = 0.0
    is_active: bool = True
    featured: bool = False
    level: str = "beginner"  # beginner, intermediate, advanced
    duration: Optional[int] = None  # durée totale en minutes
    language: str = "fr"
    prerequisites: Optional[List[str]] = None
    objectives: Optional[List[str]] = None

class CourseCreate(CourseBase):
    slug: Optional[str] = None
    modules: List[Module] = []

    def __init__(self, **data):
        super().__init__(**data)
        if not self.slug:
            self.slug = generate_slug(self.title)
        if not self.duration:
            # Calculer la durée totale à partir des modules et leçons
            total_duration = sum(
                sum(lesson.duration for lesson in module.lessons)
                for module in self.modules
            )
            self.duration = total_duration

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[PyObjectId] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None
    featured: Optional[bool] = None
    level: Optional[str] = None
    duration: Optional[int] = None
    language: Optional[str] = None
    prerequisites: Optional[List[str]] = None
    objectives: Optional[List[str]] = None
    slug: Optional[str] = None
    modules: Optional[List[Module]] = None

class CourseInDB(CourseBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    slug: str
    modules: List[Module] = []
    enrolled_students: int = 0
    rating: float = 0.0
    total_ratings: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "Développement Web Full Stack",
                "description": "Apprenez à créer des applications web modernes",
                "category_id": "507f1f77bcf86cd799439011",
                "price": 99.99,
                "is_active": True,
                "featured": False,
                "level": "beginner",
                "duration": 1200,
                "language": "fr",
                "prerequisites": ["Bases de l'informatique"],
                "objectives": ["Créer une application web complète"],
                "slug": "developpement-web-full-stack",
                "modules": [],
                "enrolled_students": 0,
                "rating": 0.0,
                "total_ratings": 0,
                "created_at": "2024-01-15T10:00:00",
                "updated_at": "2024-01-15T10:00:00"
            }
        } 