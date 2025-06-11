from fastapi import APIRouter
from ..routes import (
    auth,
    users,
    courses,
    course_categories,
    blog,
    payments,
    course_progress,
    comments,
    likes
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(course_categories.router, prefix="/course-categories", tags=["course-categories"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(course_progress.router, prefix="/course-progress", tags=["course-progress"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(likes.router, prefix="/likes", tags=["likes"])

__all__ = ["api_router"] 