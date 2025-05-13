from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
from .api.api import api_router
from .core.config import settings
from .db.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Configuration pour servir les fichiers statiques
# Créer le répertoire static/uploads s'il n'existe pas
static_dir = Path("static")
uploads_dir = static_dir / "uploads"
os.makedirs(uploads_dir, exist_ok=True)

# Monter le répertoire static
app.mount("/static", StaticFiles(directory="static"), name="static")

# Events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API Code&Sens"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
