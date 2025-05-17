from datetime import datetime, time
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

# Importer la nouvelle implémentation de PyObjectId
from ..utils.object_id_handler import PyObjectId
from .user import UserInDB

# Modèle pour les sessions de mentorat
class MentoringSessionBase(BaseModel):
    mentee_ids: List[str] = []  # Liste d'IDs de mentorés
    mentee_id: Optional[str] = None  # Gardé pour rétrocompatibilité
    date: datetime
    duration: int  # Durée en minutes
    status: str = "pending"  # pending, confirmed, completed, cancelled
    notes: Optional[str] = None
    price: float
    pricing_id: str
    meeting_url: Optional[str] = None
    cancellation_reason: Optional[str] = None

class MentoringSessionCreate(MentoringSessionBase):
    pass

class MentoringSessionUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    meeting_url: Optional[str] = None
    cancellation_reason: Optional[str] = None

class MentoringSessionInDB(MentoringSessionBase):
    id: PyObjectId = Field(default_factory=ObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "_id": "123456789012345678901234",
                "mentee_id": "123456789012345678901234",
                "date": "2025-05-20T14:00:00",
                "duration": 60,
                "status": "pending",
                "notes": "Session d'introduction",
                "price": 50.0,
                "pricing_id": "123456789012345678901234",
                "meeting_url": "https://meet.example.com/room123",
                "cancellation_reason": None,
                "created_at": "2025-05-15T00:00:00",
                "updated_at": "2025-05-15T00:00:00"
            }
        }
    }

class MentoringSessionWithMentee(MentoringSessionInDB):
    mentee: dict  # Pour rétrocompatibilité (premier mentoré)
    mentees: List[dict] = []  # Liste de tous les mentorés
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

# Modèle pour les disponibilités hebdomadaires
class AvailabilityBase(BaseModel):
    day_of_week: int  # 0 = Lundi, 6 = Dimanche
    start_time: str  # Format "HH:MM"
    end_time: str  # Format "HH:MM"
    is_available: bool = True

class AvailabilityCreate(AvailabilityBase):
    pass

class AvailabilityUpdate(BaseModel):
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    is_available: Optional[bool] = None

class AvailabilityInDB(AvailabilityBase):
    id: PyObjectId = Field(default_factory=ObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "_id": "123456789012345678901234",
                "day_of_week": 1,
                "start_time": "09:00",
                "end_time": "17:00",
                "is_available": True,
                "created_at": "2025-05-15T00:00:00",
                "updated_at": "2025-05-15T00:00:00"
            }
        }
    }

# Modèle pour les disponibilités à des dates spécifiques
class AvailableSlot(BaseModel):
    start_time: str  # Format "HH:MM"
    end_time: str  # Format "HH:MM"

class SpecificDateAvailabilityBase(BaseModel):
    date: datetime
    is_available: bool = True
    available_slots: Optional[List[AvailableSlot]] = None

class SpecificDateAvailabilityCreate(SpecificDateAvailabilityBase):
    pass

class SpecificDateAvailabilityUpdate(BaseModel):
    is_available: Optional[bool] = None
    available_slots: Optional[List[AvailableSlot]] = None

class SpecificDateAvailabilityInDB(SpecificDateAvailabilityBase):
    id: PyObjectId = Field(default_factory=ObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "_id": "123456789012345678901234",
                "date": "2025-05-20",
                "is_available": True,
                "available_slots": [
                    {"start_time": "09:00", "end_time": "10:00"},
                    {"start_time": "14:00", "end_time": "15:00"}
                ],
                "created_at": "2025-05-15T00:00:00",
                "updated_at": "2025-05-15T00:00:00"
            }
        }
    }

# Modèle pour les mentorés
class MenteeBase(BaseModel):
    user_id: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    topic: Optional[str] = None
    message: Optional[str] = None
    bio: Optional[str] = None
    goals: Optional[str] = None
    skills_to_improve: Optional[List[str]] = None
    status: str = "pending"  # pending, accepted, rejected

class MenteeCreate(MenteeBase):
    pass

class MenteeUpdate(BaseModel):
    bio: Optional[str] = None
    goals: Optional[str] = None
    skills_to_improve: Optional[List[str]] = None

class MenteeInDB(MenteeBase):
    id: PyObjectId = Field(default_factory=ObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "_id": "123456789012345678901234",
                "user_id": "123456789012345678901234",
                "bio": "Développeur web junior",
                "goals": "Améliorer mes compétences en React",
                "skills_to_improve": ["React", "TypeScript", "NextJS"],
                "created_at": "2025-05-15T00:00:00",
                "updated_at": "2025-05-15T00:00:00"
            }
        }
    }

class MenteeWithUser(MenteeInDB):
    user: dict
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

# Modèle pour les tarifs
class MentoringPricingBase(BaseModel):
    name: str
    description: str
    price: float
    duration: int  # Durée en minutes
    is_active: bool = True

class MentoringPricingCreate(MentoringPricingBase):
    pass

class MentoringPricingUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None
    is_active: Optional[bool] = None

class MentoringPricingInDB(MentoringPricingBase):
    id: PyObjectId = Field(default_factory=ObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "_id": "123456789012345678901234",
                "name": "Session standard",
                "description": "Session de mentorat de 60 minutes",
                "price": 50.0,
                "duration": 60,
                "is_active": True,
                "created_at": "2025-05-15T00:00:00",
                "updated_at": "2025-05-15T00:00:00"
            }
        }
    }
