from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
import bcrypt
from ..core.config import settings

# Utiliser une configuration plus simple pour éviter les problèmes de compatibilité
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

def create_access_token(subject: Union[str, Any], is_admin: bool = False, expires_delta: timedelta = None) -> str:
    to_encode = {"sub": str(subject), "is_admin": is_admin}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
