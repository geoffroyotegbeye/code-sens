from fastapi import APIRouter
from ..routes import (
    auth,
    users,
    courses,
    course_categories,
    blog,
    mentors,
    mentorship,
    payments
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(course_categories.router, prefix="/course-categories", tags=["course-categories"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(mentors.router, prefix="/mentors", tags=["mentors"])
api_router.include_router(mentorship.router, prefix="/mentorship", tags=["mentorship"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])

__all__ = ["api_router"] 