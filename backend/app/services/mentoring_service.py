from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from ..db.mongodb import get_database
from ..models.mentoring import (
    MentoringSessionInDB, 
    MentoringSessionWithMentee,
    AvailabilityInDB,
    SpecificDateAvailabilityInDB,
    MenteeInDB,
    MenteeWithUser,
    MentoringPricingInDB
)
from ..models.user import UserInDB

# Collections
async def get_sessions_collection():
    db = await get_database()
    return db.mentoring_sessions

async def get_availability_collection():
    db = await get_database()
    return db.mentoring_availability

async def get_specific_date_availability_collection():
    db = await get_database()
    return db.mentoring_specific_date_availability

async def get_mentees_collection():
    db = await get_database()
    return db.mentoring_mentees

async def get_pricing_collection():
    db = await get_database()
    return db.mentoring_pricing

async def get_users_collection():
    db = await get_database()
    return db.users

# Services pour les sessions de mentorat
async def get_all_mentoring_sessions() -> List[MentoringSessionInDB]:
    collection = await get_sessions_collection()
    sessions = await collection.find().to_list(1000)
    return [MentoringSessionInDB(**session) for session in sessions]

async def get_all_mentoring_sessions_with_mentee() -> List[MentoringSessionWithMentee]:
    collection = await get_sessions_collection()
    mentees_collection = await get_mentees_collection()
    users_collection = await get_users_collection()
    
    sessions = await collection.find().to_list(1000)
    result = []
    
    for session in sessions:
        mentee = await mentees_collection.find_one({"_id": ObjectId(session["mentee_id"])})
        if mentee:
            user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
            if user:
                # Supprimer le mot de passe du dictionnaire user
                if "hashed_password" in user:
                    del user["hashed_password"]
                
                session_with_mentee = MentoringSessionWithMentee(
                    **session,
                    mentee={**mentee, "user": user}
                )
                result.append(session_with_mentee)
    
    return result

async def get_mentoring_session_by_id(session_id: str) -> Optional[MentoringSessionWithMentee]:
    collection = await get_sessions_collection()
    mentees_collection = await get_mentees_collection()
    users_collection = await get_users_collection()
    
    session = await collection.find_one({"_id": ObjectId(session_id)})
    if not session:
        return None
    
    mentee = await mentees_collection.find_one({"_id": ObjectId(session["mentee_id"])})
    if mentee:
        user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
        if user:
            # Supprimer le mot de passe du dictionnaire user
            if "hashed_password" in user:
                del user["hashed_password"]
            
            return MentoringSessionWithMentee(
                **session,
                mentee={**mentee, "user": user}
            )
    
    return MentoringSessionInDB(**session)

async def get_mentoring_sessions_by_mentee_id(mentee_id: str) -> List[MentoringSessionInDB]:
    collection = await get_sessions_collection()
    sessions = await collection.find({"mentee_id": mentee_id}).to_list(1000)
    return [MentoringSessionInDB(**session) for session in sessions]

async def create_mentoring_session(session_data: dict) -> MentoringSessionInDB:
    collection = await get_sessions_collection()
    session_data["created_at"] = datetime.utcnow()
    session_data["updated_at"] = datetime.utcnow()
    
    result = await collection.insert_one(session_data)
    session = await collection.find_one({"_id": result.inserted_id})
    return MentoringSessionInDB(**session)

async def update_mentoring_session(session_id: str, session_data: dict) -> Optional[MentoringSessionInDB]:
    collection = await get_sessions_collection()
    session_data["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": session_data}
    )
    
    updated_session = await collection.find_one({"_id": ObjectId(session_id)})
    if not updated_session:
        return None
    
    return MentoringSessionInDB(**updated_session)

async def delete_mentoring_session(session_id: str) -> bool:
    collection = await get_sessions_collection()
    result = await collection.delete_one({"_id": ObjectId(session_id)})
    return result.deleted_count > 0

async def confirm_mentoring_session(session_id: str, meeting_url: str) -> Optional[MentoringSessionInDB]:
    return await update_mentoring_session(
        session_id,
        {
            "status": "confirmed",
            "meeting_url": meeting_url
        }
    )

async def cancel_mentoring_session(session_id: str, reason: str) -> Optional[MentoringSessionInDB]:
    return await update_mentoring_session(
        session_id,
        {
            "status": "cancelled",
            "cancellation_reason": reason
        }
    )

async def complete_mentoring_session(session_id: str, notes: str) -> Optional[MentoringSessionInDB]:
    return await update_mentoring_session(
        session_id,
        {
            "status": "completed",
            "notes": notes
        }
    )

# Services pour les disponibilités hebdomadaires
async def get_all_weekly_availability() -> List[AvailabilityInDB]:
    collection = await get_availability_collection()
    availabilities = await collection.find().to_list(1000)
    return [AvailabilityInDB(**availability) for availability in availabilities]

async def create_weekly_availability(availability_data: dict) -> AvailabilityInDB:
    collection = await get_availability_collection()
    availability_data["created_at"] = datetime.utcnow()
    availability_data["updated_at"] = datetime.utcnow()
    
    result = await collection.insert_one(availability_data)
    availability = await collection.find_one({"_id": result.inserted_id})
    return AvailabilityInDB(**availability)

async def update_weekly_availability(availability_id: str, availability_data: dict) -> Optional[AvailabilityInDB]:
    collection = await get_availability_collection()
    availability_data["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"_id": ObjectId(availability_id)},
        {"$set": availability_data}
    )
    
    updated_availability = await collection.find_one({"_id": ObjectId(availability_id)})
    if not updated_availability:
        return None
    
    return AvailabilityInDB(**updated_availability)

async def delete_weekly_availability(availability_id: str) -> bool:
    collection = await get_availability_collection()
    result = await collection.delete_one({"_id": ObjectId(availability_id)})
    return result.deleted_count > 0

# Services pour les disponibilités à des dates spécifiques
async def get_specific_date_availability(date: str) -> Optional[SpecificDateAvailabilityInDB]:
    collection = await get_specific_date_availability_collection()
    availability = await collection.find_one({"date": date})
    if not availability:
        return None
    
    return SpecificDateAvailabilityInDB(**availability)

async def set_specific_date_availability(availability_data: dict) -> SpecificDateAvailabilityInDB:
    collection = await get_specific_date_availability_collection()
    
    # Vérifier si une disponibilité existe déjà pour cette date
    existing = await collection.find_one({"date": availability_data["date"]})
    
    if existing:
        availability_data["updated_at"] = datetime.utcnow()
        await collection.update_one(
            {"_id": existing["_id"]},
            {"$set": availability_data}
        )
        updated = await collection.find_one({"_id": existing["_id"]})
        return SpecificDateAvailabilityInDB(**updated)
    else:
        availability_data["created_at"] = datetime.utcnow()
        availability_data["updated_at"] = datetime.utcnow()
        result = await collection.insert_one(availability_data)
        availability = await collection.find_one({"_id": result.inserted_id})
        return SpecificDateAvailabilityInDB(**availability)

# Services pour les mentorés
async def get_all_mentees() -> List[MenteeWithUser]:
    collection = await get_mentees_collection()
    users_collection = await get_users_collection()
    
    mentees = await collection.find().to_list(1000)
    result = []
    
    for mentee in mentees:
        user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
        if user:
            # Supprimer le mot de passe du dictionnaire user
            if "hashed_password" in user:
                del user["hashed_password"]
            
            mentee_with_user = MenteeWithUser(
                **mentee,
                user=user
            )
            result.append(mentee_with_user)
    
    return result

async def get_mentee_by_id(mentee_id: str) -> Optional[MenteeWithUser]:
    collection = await get_mentees_collection()
    users_collection = await get_users_collection()
    
    mentee = await collection.find_one({"_id": ObjectId(mentee_id)})
    if not mentee:
        return None
    
    user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
    if user:
        # Supprimer le mot de passe du dictionnaire user
        if "hashed_password" in user:
            del user["hashed_password"]
        
        return MenteeWithUser(
            **mentee,
            user=user
        )
    
    return MenteeInDB(**mentee)

async def get_mentee_by_user_id(user_id: str) -> Optional[MenteeInDB]:
    collection = await get_mentees_collection()
    mentee = await collection.find_one({"user_id": user_id})
    if not mentee:
        return None
    
    return MenteeInDB(**mentee)

async def create_mentee(mentee_data: dict) -> MenteeInDB:
    collection = await get_mentees_collection()
    mentee_data["created_at"] = datetime.utcnow()
    mentee_data["updated_at"] = datetime.utcnow()
    
    result = await collection.insert_one(mentee_data)
    mentee = await collection.find_one({"_id": result.inserted_id})
    return MenteeInDB(**mentee)

async def update_mentee(mentee_id: str, mentee_data: dict) -> Optional[MenteeInDB]:
    collection = await get_mentees_collection()
    mentee_data["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"_id": ObjectId(mentee_id)},
        {"$set": mentee_data}
    )
    
    updated_mentee = await collection.find_one({"_id": ObjectId(mentee_id)})
    if not updated_mentee:
        return None
    
    return MenteeInDB(**updated_mentee)

# Services pour les tarifs
async def get_all_pricing() -> List[MentoringPricingInDB]:
    collection = await get_pricing_collection()
    pricing = await collection.find().to_list(1000)
    return [MentoringPricingInDB(**price) for price in pricing]

async def get_pricing_by_id(pricing_id: str) -> Optional[MentoringPricingInDB]:
    collection = await get_pricing_collection()
    pricing = await collection.find_one({"_id": ObjectId(pricing_id)})
    if not pricing:
        return None
    
    return MentoringPricingInDB(**pricing)

async def create_pricing(pricing_data: dict) -> MentoringPricingInDB:
    collection = await get_pricing_collection()
    pricing_data["created_at"] = datetime.utcnow()
    pricing_data["updated_at"] = datetime.utcnow()
    
    result = await collection.insert_one(pricing_data)
    pricing = await collection.find_one({"_id": result.inserted_id})
    return MentoringPricingInDB(**pricing)

async def update_pricing(pricing_id: str, pricing_data: dict) -> Optional[MentoringPricingInDB]:
    collection = await get_pricing_collection()
    pricing_data["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"_id": ObjectId(pricing_id)},
        {"$set": pricing_data}
    )
    
    updated_pricing = await collection.find_one({"_id": ObjectId(pricing_id)})
    if not updated_pricing:
        return None
    
    return MentoringPricingInDB(**updated_pricing)

async def delete_pricing(pricing_id: str) -> bool:
    collection = await get_pricing_collection()
    result = await collection.delete_one({"_id": ObjectId(pricing_id)})
    return result.deleted_count > 0
