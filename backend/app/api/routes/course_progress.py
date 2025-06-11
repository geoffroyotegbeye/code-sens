from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from ...db.mongodb import get_database
from ...models.course_progress import UserCourseProgressCreate, UserCourseProgressUpdate, UserCourseProgressInDB
from ...core.auth import get_current_user
from ...models.user import UserInDB
from ...models.course import CourseInDB

router = APIRouter()

@router.post("/", response_model=UserCourseProgressInDB)
async def create_course_progress(
    progress: UserCourseProgressCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Crée un nouvel enregistrement de progression pour un utilisateur qui commence une formation.
    """
    db = await get_database()
    
    # Vérifier si l'utilisateur a déjà commencé ce cours
    existing_progress = await db.user_course_progress.find_one({
        "user_id": current_user.id,
        "course_id": progress.course_id
    })
    
    if existing_progress:
        # Si l'utilisateur a déjà commencé ce cours, on renvoie la progression existante
        return UserCourseProgressInDB(**existing_progress)
    
    # Vérifier que le cours existe
    course = await db.courses.find_one({"_id": progress.course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    # Assurer que l'utilisateur est bien celui qui est connecté
    progress_dict = progress.dict(by_alias=True)
    progress_dict["user_id"] = current_user.id
    progress_dict["started_at"] = datetime.utcnow()
    progress_dict["last_accessed_at"] = datetime.utcnow()
    
    # Ajouter l'utilisateur à la liste des inscrits au cours s'il n'y est pas déjà
    await db.users.update_one(
        {"_id": current_user.id},
        {"$addToSet": {"enrolled_courses": str(progress.course_id)}}
    )
    
    result = await db.user_course_progress.insert_one(progress_dict)
    created_progress = await db.user_course_progress.find_one({"_id": result.inserted_id})
    
    return UserCourseProgressInDB(**created_progress)

@router.get("/user/current", response_model=List[UserCourseProgressInDB])
async def get_user_course_progress(
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Récupère la progression de l'utilisateur connecté pour tous ses cours.
    """
    db = await get_database()
    progress_list = await db.user_course_progress.find({"user_id": current_user.id}).to_list(length=100)
    return [UserCourseProgressInDB(**progress) for progress in progress_list]

@router.get("/course/{course_id}/user/current", response_model=UserCourseProgressInDB)
async def get_course_progress_for_current_user(
    course_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Récupère la progression de l'utilisateur connecté pour un cours spécifique.
    """
    db = await get_database()
    progress = await db.user_course_progress.find_one({
        "user_id": current_user.id,
        "course_id": ObjectId(course_id)
    })
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progression non trouvée pour ce cours")
    
    return UserCourseProgressInDB(**progress)

@router.put("/{progress_id}", response_model=UserCourseProgressInDB)
async def update_course_progress(
    progress_id: str,
    progress_update: UserCourseProgressUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Met à jour la progression d'un utilisateur pour un cours.
    """
    db = await get_database()
    
    # Vérifier que la progression existe et appartient à l'utilisateur
    existing_progress = await db.user_course_progress.find_one({
        "_id": ObjectId(progress_id),
        "user_id": current_user.id
    })
    
    if not existing_progress:
        raise HTTPException(status_code=404, detail="Progression non trouvée ou non autorisée")
    
    # Mettre à jour la progression
    update_data = progress_update.dict(exclude_unset=True)
    update_data["last_accessed_at"] = datetime.utcnow()
    
    await db.user_course_progress.update_one(
        {"_id": ObjectId(progress_id)},
        {"$set": update_data}
    )
    
    updated_progress = await db.user_course_progress.find_one({"_id": ObjectId(progress_id)})
    return UserCourseProgressInDB(**updated_progress)

@router.post("/lesson/{lesson_id}/complete", response_model=UserCourseProgressInDB)
async def complete_lesson(
    lesson_id: str,
    course_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Marque une leçon comme complétée et met à jour la progression globale.
    """
    db = await get_database()
    
    # Récupérer la progression actuelle
    progress = await db.user_course_progress.find_one({
        "user_id": current_user.id,
        "course_id": ObjectId(course_id)
    })
    
    if not progress:
        # Si l'utilisateur n'a pas encore de progression pour ce cours, en créer une
        new_progress = UserCourseProgressCreate(
            user_id=current_user.id,
            course_id=ObjectId(course_id),
            completed_lessons=[ObjectId(lesson_id)],
            last_lesson_id=ObjectId(lesson_id)
        )
        return await create_course_progress(new_progress, current_user)
    
    # Récupérer le cours pour calculer la progression
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    # Calculer le nombre total de leçons dans le cours
    total_lessons = sum(len(module.get("lessons", [])) for module in course.get("modules", []))
    
    # Ajouter la leçon à la liste des leçons complétées si elle n'y est pas déjà
    completed_lessons = progress.get("completed_lessons", [])
    if ObjectId(lesson_id) not in completed_lessons:
        completed_lessons.append(ObjectId(lesson_id))
    
    # Calculer le pourcentage de progression
    progress_percentage = (len(completed_lessons) / total_lessons * 100) if total_lessons > 0 else 0
    
    # Vérifier si le cours est complété
    is_completed = len(completed_lessons) >= total_lessons
    
    # Mettre à jour la progression
    await db.user_course_progress.update_one(
        {"_id": progress["_id"]},
        {
            "$set": {
                "completed_lessons": completed_lessons,
                "last_lesson_id": ObjectId(lesson_id),
                "last_accessed_at": datetime.utcnow(),
                "progress_percentage": progress_percentage,
                "is_completed": is_completed
            }
        }
    )
    
    updated_progress = await db.user_course_progress.find_one({"_id": progress["_id"]})
    return UserCourseProgressInDB(**updated_progress)
