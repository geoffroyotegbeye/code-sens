import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Code&Sens API"
    
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "codesens")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "default_secret_key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # URL du backend
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "http://localhost:8000")

    class Config:
        case_sensitive = True

settings = Settings()
