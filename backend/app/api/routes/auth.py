from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError

from ...core.config import settings
from ...core.security import create_access_token
from ...models.user import User, UserCreate
from ...schemas.token import Token, TokenPayload
from ...services.user_service import authenticate_user, create_user, get_user_by_id

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        print(f"Received token: {token[:10]}...")
        print(f"SECRET_KEY: {settings.SECRET_KEY[:5]}...")
        print(f"ALGORITHM: {settings.ALGORITHM}")
        
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        print(f"Decoded payload: {payload}")
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError) as e:
        print(f"JWT Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Could not validate credentials: {str(e)}",
        )
    
    print(f"Looking for user with ID: {token_data.sub}")
    user = await get_user_by_id(token_data.sub)
    if not user:
        print(f"User not found with ID: {token_data.sub}")
        raise HTTPException(status_code=404, detail="User not found")
    print(f"Found user: {user.email}")
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user

async def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="The user doesn't have enough privileges"
        )
    return current_user

@router.post("/register", response_model=User)
async def register_user(user_in: UserCreate):
    user = await create_user(user_in)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return user

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), is_admin=user.is_admin, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
