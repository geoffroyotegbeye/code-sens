# Route à ajouter à courses.py

# Ajouter ces imports au début du fichier si ce n'est pas déjà fait:
# from ...core.auth import get_current_user
# from ...models.user import UserInDB

# Ajouter cette route à la fin du fichier courses.py:

@router.get("/user/enrolled", response_model=List[CourseInDB])
async def get_user_enrolled_courses(current_user: UserInDB = Depends(get_current_user)):
    db = await get_database()
    
    # Vérifier si l'utilisateur a un champ enrolled_courses
    user = await db.users.find_one({"_id": current_user.id})
    if not user or "enrolled_courses" not in user or not user["enrolled_courses"]:
        return []
    
    # Récupérer les IDs des cours auxquels l'utilisateur est inscrit
    course_ids = [ObjectId(course_id) for course_id in user["enrolled_courses"]]
    
    # Récupérer les cours correspondants
    courses = await db.courses.find({"_id": {"$in": course_ids}}).to_list(length=100)
    return [CourseInDB(**course) for course in courses]
