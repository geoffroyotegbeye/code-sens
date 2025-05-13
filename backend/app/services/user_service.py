from bson import ObjectId
from typing import Optional
from ..db.database import get_database
from ..core.security import get_password_hash, verify_password
from ..models.user import UserInDB, UserCreate

async def get_user_by_email(email: str) -> Optional[UserInDB]:
    db = await get_database()
    try:
        user = await db.users.find_one({"email": email})
        if user:
            # Convertir l'ObjectId en string pour qu'il soit compatible avec PyObjectId
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None
    except Exception as e:
        print(f"Error getting user by email: {e}")
        return None

async def get_user_by_id(user_id: str) -> Optional[UserInDB]:
    db = await get_database()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            # Convertir l'ObjectId en string pour qu'il soit compatible avec PyObjectId
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None
    except Exception as e:
        print(f"Error getting user by ID: {e}")
        return None

async def create_user(user: UserCreate) -> UserInDB:
    db = await get_database()
    
    try:
        # Check if user already exists
        existing_user = await get_user_by_email(user.email)
        if existing_user:
            return None
        
        # Create new user
        user_data = user.model_dump(exclude={"password"})
        
        # Synchroniser le champ role avec is_admin
        if user_data.get("is_admin", False):
            user_data["role"] = "admin"
        else:
            user_data["role"] = "user"
            
        user_in_db = UserInDB(
            **user_data,
            hashed_password=get_password_hash(user.password)
        )
        
        # Insert user into database
        user_dict = user_in_db.model_dump(by_alias=True)
        # Convertir l'id string en ObjectId pour MongoDB
        if "_id" in user_dict and isinstance(user_dict["_id"], str):
            user_dict["_id"] = ObjectId(user_dict["_id"])
            
        result = await db.users.insert_one(user_dict)
        
        # Get the created user
        created_user = await get_user_by_id(str(result.inserted_id))
        return created_user
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

async def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
    user = await get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
