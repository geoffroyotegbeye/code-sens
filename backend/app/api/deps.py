from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from typing import Optional

from ..core.config import settings
from ..models.user import UserInDB
from ..services.user_service import get_user_by_id
from ..schemas.token import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    """
    Récupère l'utilisateur actuel à partir du token JWT.
    """
    try:
        # Décoder le token JWT
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError) as e:
        print(f"Erreur lors de la validation du token: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Impossible de valider les informations d'identification",
        )
    
    # Récupérer l'utilisateur à partir de l'ID dans le token
    user = await get_user_by_id(token_data.sub)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé",
        )
    
    return user

async def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[UserInDB]:
    """
    Récupère l'utilisateur actuel à partir du token JWT, mais ne lève pas d'exception si le token est invalide.
    """
    if not token:
        return None
    
    try:
        # Décoder le token JWT
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        
        # Récupérer l'utilisateur à partir de l'ID dans le token
        user = await get_user_by_id(token_data.sub)
        return user
    except (JWTError, ValidationError):
        return None

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """
    Vérifie que l'utilisateur est actif.
    """
    # Ici, vous pourriez ajouter une vérification pour voir si l'utilisateur est actif
    # Par exemple, si vous avez un champ 'is_active' dans votre modèle d'utilisateur
    # if not current_user.is_active:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Utilisateur inactif",
    #     )
    return current_user

async def get_current_admin_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """
    Vérifie que l'utilisateur est un administrateur.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Droits d'administrateur requis",
        )
    return current_user
