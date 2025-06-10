import uuid
from datetime import datetime
from fastapi import HTTPException
from typing import Optional, List

async def create_lesson(module_id: str, lesson: Lesson) -> Lesson:
    lesson_dict = lesson.dict()
    lesson_dict["id"] = str(uuid.uuid4())
    lesson_dict["created_at"] = datetime.utcnow()
    lesson_dict["updated_at"] = datetime.utcnow()
    
    # Assurer que video_url est correctement géré
    if "video_url" not in lesson_dict and "videoUrl" in lesson_dict:
        lesson_dict["video_url"] = lesson_dict.pop("videoUrl")
    
    # Récupérer le module
    module = await get_module(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Ajouter la leçon au module
    if "lessons" not in module:
        module["lessons"] = []
    module["lessons"].append(lesson_dict)
    
    # Mettre à jour le module dans la base de données
    await update_module(module_id, module)
    
    return Lesson(**lesson_dict)

async def get_lesson(module_id: str, lesson_id: str) -> Optional[Lesson]:
    module = await get_module(module_id)
    if not module or "lessons" not in module:
        return None
    
    for lesson in module["lessons"]:
        if lesson["id"] == lesson_id:
            # Assurer que video_url est présent
            if "video_url" not in lesson and "videoUrl" in lesson:
                lesson["video_url"] = lesson.pop("videoUrl")
            return Lesson(**lesson)
    return None

async def get_module_lessons(module_id: str) -> List[Lesson]:
    module = await get_module(module_id)
    if not module or "lessons" not in module:
        return []
    
    lessons = []
    for lesson in module["lessons"]:
        # Assurer que video_url est présent
        if "video_url" not in lesson and "videoUrl" in lesson:
            lesson["video_url"] = lesson.pop("videoUrl")
        lessons.append(Lesson(**lesson))
    return lessons 