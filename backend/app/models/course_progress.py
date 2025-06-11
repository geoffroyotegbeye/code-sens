from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from ..utils.object_id_handler import PyObjectId

class UserCourseProgressBase(BaseModel):
    user_id: PyObjectId = Field(...)
    course_id: PyObjectId = Field(...)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_accessed_at: datetime = Field(default_factory=datetime.utcnow)
    completed_lessons: List[PyObjectId] = Field(default_factory=list)
    last_lesson_id: Optional[PyObjectId] = None
    progress_percentage: float = Field(default=0)
    is_completed: bool = Field(default=False)
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

class UserCourseProgressCreate(UserCourseProgressBase):
    pass

class UserCourseProgressUpdate(BaseModel):
    last_accessed_at: Optional[datetime] = None
    completed_lessons: Optional[List[PyObjectId]] = None
    last_lesson_id: Optional[PyObjectId] = None
    progress_percentage: Optional[float] = None
    is_completed: Optional[bool] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

class UserCourseProgressInDB(UserCourseProgressBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
