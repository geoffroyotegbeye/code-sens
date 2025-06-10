from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from ...db.mongodb import get_database
from ...models.course import CourseCreate, CourseUpdate, CourseInDB, Module, Lesson
from ...core.auth import get_current_admin_user

router = APIRouter()

# Routes pour les formations
@router.post("/", response_model=CourseInDB)
async def create_course(
    course: CourseCreate,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    # Vérifier si le slug existe déjà
    existing_course = await db.courses.find_one({"slug": course.slug})
    if existing_course:
        raise HTTPException(status_code=400, detail="Un cours avec ce slug existe déjà")
    
    # Calculer la durée totale
    total_duration = sum(
        sum(lesson.duration for lesson in module.lessons)
        for module in course.modules
    )
    course.duration = total_duration

    course_dict = course.dict(by_alias=True)
    course_dict["created_at"] = datetime.utcnow()
    course_dict["updated_at"] = datetime.utcnow()
    
    result = await db.courses.insert_one(course_dict)
    created_course = await db.courses.find_one({"_id": result.inserted_id})
    return CourseInDB(**created_course)

@router.get("/", response_model=List[CourseInDB])
async def get_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category_id: Optional[str] = None,
    featured: Optional[bool] = None,
    is_active: Optional[bool] = None
):
    db = await get_database()
    query = {}
    
    if category_id:
        query["category_id"] = ObjectId(category_id)
    if featured is not None:
        query["featured"] = featured
    if is_active is not None:
        query["is_active"] = is_active

    courses = await db.courses.find(query).skip(skip).limit(limit).to_list(length=limit)
    return [CourseInDB(**course) for course in courses]

@router.get("/{course_id}", response_model=CourseInDB)
async def get_course(course_id: str):
    db = await get_database()
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    return CourseInDB(**course)

@router.get("/slug/{slug}", response_model=CourseInDB)
async def get_course_by_slug(slug: str):
    db = await get_database()
    course = await db.courses.find_one({"slug": slug})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    return CourseInDB(**course)

@router.put("/{course_id}", response_model=CourseInDB)
async def update_course(
    course_id: str,
    course_update: CourseUpdate,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")

    update_data = course_update.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.courses.update_one(
            {"_id": ObjectId(course_id)},
            {"$set": update_data}
        )
    
    updated_course = await db.courses.find_one({"_id": ObjectId(course_id)})
    return CourseInDB(**updated_course)

@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    result = await db.courses.delete_one({"_id": ObjectId(course_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    return {"message": "Cours supprimé avec succès"}

# Routes pour les modules
@router.post("/{course_id}/modules", response_model=CourseInDB)
async def add_module(
    course_id: str,
    module: Module,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")

    # Calculer le nouvel ordre si non spécifié
    if not module.order:
        module.order = len(course.get("modules", [])) + 1

    module_dict = module.dict()
    module_dict["created_at"] = datetime.utcnow()
    module_dict["updated_at"] = datetime.utcnow()

    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$push": {"modules": module_dict}}
    )

    updated_course = await db.courses.find_one({"_id": ObjectId(course_id)})
    return CourseInDB(**updated_course)

@router.put("/{course_id}/modules/{module_index}", response_model=CourseInDB)
async def update_module(
    course_id: str,
    module_index: int,
    module_update: Module,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")

    if module_index >= len(course.get("modules", [])):
        raise HTTPException(status_code=404, detail="Module non trouvé")

    update_data = module_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()

    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$set": {f"modules.{module_index}": update_data}}
    )

    updated_course = await db.courses.find_one({"_id": ObjectId(course_id)})
    return CourseInDB(**updated_course)

@router.delete("/{course_id}/modules/{module_index}", response_model=CourseInDB)
async def delete_module(
    course_id: str,
    module_index: int,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")

    if module_index >= len(course.get("modules", [])):
        raise HTTPException(status_code=404, detail="Module non trouvé")

    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$unset": {f"modules.{module_index}": ""}}
    )
    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$pull": {"modules": None}}
    )

    updated_course = await db.courses.find_one({"_id": ObjectId(course_id)})
    return CourseInDB(**updated_course)

# Routes pour les leçons
@router.post("/{course_id}/modules/{module_index}/lessons", response_model=CourseInDB)
async def add_lesson(
    course_id: str,
    module_index: int,
    lesson: Lesson,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")

    if module_index >= len(course.get("modules", [])):
        raise HTTPException(status_code=404, detail="Module non trouvé")

    # Calculer le nouvel ordre si non spécifié
    if not lesson.order:
        module = course["modules"][module_index]
        lesson.order = len(module.get("lessons", [])) + 1

    lesson_dict = lesson.dict()
    lesson_dict["created_at"] = datetime.utcnow()
    lesson_dict["updated_at"] = datetime.utcnow()

    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$push": {f"modules.{module_index}.lessons": lesson_dict}}
    )

    updated_course = await db.courses.find_one({"_id": ObjectId(course_id)})
    return CourseInDB(**updated_course)

@router.put("/{course_id}/modules/{module_index}/lessons/{lesson_index}", response_model=CourseInDB)
async def update_lesson(
    course_id: str,
    module_index: int,
    lesson_index: int,
    lesson_update: Lesson,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")

    if module_index >= len(course.get("modules", [])):
        raise HTTPException(status_code=404, detail="Module non trouvé")

    module = course["modules"][module_index]
    if lesson_index >= len(module.get("lessons", [])):
        raise HTTPException(status_code=404, detail="Leçon non trouvée")

    update_data = lesson_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()

    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$set": {f"modules.{module_index}.lessons.{lesson_index}": update_data}}
    )

    updated_course = await db.courses.find_one({"_id": ObjectId(course_id)})
    return CourseInDB(**updated_course)

@router.delete("/{course_id}/modules/{module_index}/lessons/{lesson_index}", response_model=CourseInDB)
async def delete_lesson(
    course_id: str,
    module_index: int,
    lesson_index: int,
    current_user = Depends(get_current_admin_user)
):
    db = await get_database()
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")

    if module_index >= len(course.get("modules", [])):
        raise HTTPException(status_code=404, detail="Module non trouvé")

    module = course["modules"][module_index]
    if lesson_index >= len(module.get("lessons", [])):
        raise HTTPException(status_code=404, detail="Leçon non trouvée")

    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$unset": {f"modules.{module_index}.lessons.{lesson_index}": ""}}
    )
    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$pull": {f"modules.{module_index}.lessons": None}}
    )

    updated_course = await db.courses.find_one({"_id": ObjectId(course_id)})
    return CourseInDB(**updated_course) 