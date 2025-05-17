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
        try:
            mentees_data = []
            
            # Vérifier si nous avons des mentee_ids (nouveau format)
            if "mentee_ids" in session and isinstance(session["mentee_ids"], list) and session["mentee_ids"]:
                # Traiter chaque mentee_id dans la liste
                for mentee_id in session["mentee_ids"]:
                    try:
                        if isinstance(mentee_id, str) and len(mentee_id) == 24:
                            mentee = await mentees_collection.find_one({"_id": ObjectId(mentee_id)})
                            if mentee:
                                try:
                                    user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
                                    if user:
                                        # Supprimer le mot de passe du dictionnaire user
                                        if "hashed_password" in user:
                                            del user["hashed_password"]
                                        
                                        mentees_data.append({**mentee, "user": user})
                                except Exception as e:
                                    print(f"Error processing user_id for mentee {mentee.get('_id')}: {e}")
                        else:
                            # Mentee_id non valide, créer un mentee factice
                            fake_mentee = {
                                "_id": "000000000000000000000000",
                                "user_id": "000000000000000000000000",
                                "full_name": mentee_id if isinstance(mentee_id, str) else "Inconnu",
                                "email": "email@exemple.com",
                                "status": "pending",
                                "created_at": datetime.utcnow(),
                                "updated_at": datetime.utcnow()
                            }
                            
                            fake_user = {
                                "_id": "000000000000000000000000",
                                "email": "email@exemple.com",
                                "full_name": mentee_id if isinstance(mentee_id, str) else "Inconnu"
                            }
                            
                            mentees_data.append({**fake_mentee, "user": fake_user})
                    except Exception as e:
                        print(f"Error processing mentee_id {mentee_id}: {e}")
            
            # Si aucun mentee_ids ou vide, essayer avec l'ancien format mentee_id
            elif "mentee_id" in session and session["mentee_id"]:
                mentee_id = session["mentee_id"]
                
                # Cas spécial pour "Jeanne Doe" ou autres chaînes non-ObjectId
                if mentee_id == "Jeanne Doe" or not isinstance(mentee_id, str) or (isinstance(mentee_id, str) and len(mentee_id) != 24):
                    # Créer un objet mentee factice pour les données non valides
                    fake_mentee = {
                        "_id": "000000000000000000000000",
                        "user_id": "000000000000000000000000",
                        "full_name": mentee_id if isinstance(mentee_id, str) else "Inconnu",
                        "email": "email@exemple.com",
                        "status": "pending",
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                    
                    fake_user = {
                        "_id": "000000000000000000000000",
                        "email": "email@exemple.com",
                        "full_name": mentee_id if isinstance(mentee_id, str) else "Inconnu"
                    }
                    
                    mentees_data.append({**fake_mentee, "user": fake_user})
                else:
                    try:
                        mentee = await mentees_collection.find_one({"_id": ObjectId(mentee_id)})
                        if mentee:
                            try:
                                user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
                                if user:
                                    # Supprimer le mot de passe du dictionnaire user
                                    if "hashed_password" in user:
                                        del user["hashed_password"]
                                    
                                    mentees_data.append({**mentee, "user": user})
                            except Exception as e:
                                print(f"Error processing user_id for mentee {mentee.get('_id')}: {e}")
                    except Exception as e:
                        print(f"Error processing mentee_id {mentee_id}: {e}")
            
            # Si nous avons des mentees, créer la session
            if mentees_data:
                # Utiliser le premier mentee pour la rétrocompatibilité
                primary_mentee = mentees_data[0]
                
                session_with_mentee = MentoringSessionWithMentee(
                    **session,
                    mentee=primary_mentee,  # Pour rétrocompatibilité
                    mentees=mentees_data    # Nouveau champ avec tous les mentees
                )
                result.append(session_with_mentee)
            
        except Exception as e:
            print(f"Error processing session {session.get('_id', 'unknown')}: {e}")
    
    return result

async def get_mentoring_session_by_id(session_id: str) -> Optional[MentoringSessionWithMentee]:
    collection = await get_sessions_collection()
    mentees_collection = await get_mentees_collection()
    users_collection = await get_users_collection()
    
    try:
        session = await collection.find_one({"_id": ObjectId(session_id)})
        if not session:
            return None
        
        try:
            # Vérifier si mentee_id est un ObjectId valide
            if not isinstance(session["mentee_id"], str) or len(session["mentee_id"]) != 24:
                print(f"Invalid mentee_id format: {session['mentee_id']} in session {session.get('_id', 'unknown')}.")
                return MentoringSessionInDB(**session)
                
            mentee = await mentees_collection.find_one({"_id": ObjectId(session["mentee_id"])})
            if mentee:
                try:
                    user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
                    if user:
                        # Supprimer le mot de passe du dictionnaire user
                        if "hashed_password" in user:
                            del user["hashed_password"]
                        
                        return MentoringSessionWithMentee(
                            **session,
                            mentee={**mentee, "user": user}
                        )
                except Exception as e:
                    print(f"Error processing user_id for mentee {mentee.get('_id')}: {e}")
        except Exception as e:
            print(f"Error processing mentee_id for session {session.get('_id')}: {e}")
            
        return MentoringSessionInDB(**session)
    except Exception as e:
        print(f"Error finding session with id {session_id}: {e}")
        return None

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
    
    # Convertir les ObjectId en str pour éviter les problèmes de sérialisation
    for availability in availabilities:
        if '_id' in availability and isinstance(availability['_id'], ObjectId):
            availability['_id'] = str(availability['_id'])
    
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
    
    # Convertir les ObjectId en str pour éviter les problèmes de sérialisation
    if '_id' in availability and isinstance(availability['_id'], ObjectId):
        availability['_id'] = str(availability['_id'])
    
    return SpecificDateAvailabilityInDB(**availability)

async def set_specific_date_availability(availability_data: dict) -> SpecificDateAvailabilityInDB:
    collection = await get_specific_date_availability_collection()
    
    # Vérifier si une disponibilité existe déjà pour cette date
    existing = await collection.find_one({"date": availability_data["date"]})
    
    if existing:
        # Convertir les ObjectId en str pour éviter les problèmes de sérialisation
        if '_id' in existing and isinstance(existing['_id'], ObjectId):
            existing['_id'] = str(existing['_id'])
            
        availability_data["updated_at"] = datetime.utcnow()
        await collection.update_one(
            {"_id": ObjectId(existing["_id"]) if isinstance(existing["_id"], str) else existing["_id"]},
            {"$set": availability_data}
        )
        updated = await collection.find_one({"_id": ObjectId(existing["_id"]) if isinstance(existing["_id"], str) else existing["_id"]})
        
        # Convertir les ObjectId en str pour éviter les problèmes de sérialisation
        if updated and '_id' in updated and isinstance(updated['_id'], ObjectId):
            updated['_id'] = str(updated['_id'])
            
        return SpecificDateAvailabilityInDB(**updated)
    else:
        availability_data["created_at"] = datetime.utcnow()
        availability_data["updated_at"] = datetime.utcnow()
        result = await collection.insert_one(availability_data)
        availability = await collection.find_one({"_id": result.inserted_id})
        
        # Convertir les ObjectId en str pour éviter les problèmes de sérialisation
        if availability and '_id' in availability and isinstance(availability['_id'], ObjectId):
            availability['_id'] = str(availability['_id'])
            
        return SpecificDateAvailabilityInDB(**availability)

# Services pour les mentorés
async def get_all_mentees() -> List[MenteeWithUser]:
    collection = await get_mentees_collection()
    users_collection = await get_users_collection()
    
    mentees = await collection.find().to_list(1000)
    result = []
    
    for mentee in mentees:
        # Convertir l'ObjectId en chaîne de caractères
        mentee["_id"] = str(mentee["_id"])
        
        user = None
        if mentee.get("user_id"):
            user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
            if user:
                # Convertir l'ObjectId en chaîne de caractères
                user["_id"] = str(user["_id"])
                # Supprimer le mot de passe du dictionnaire user
                if "hashed_password" in user:
                    del user["hashed_password"]
        
        mentee_with_user = MenteeWithUser(
            **mentee,
            user=user or {}
        )
        result.append(mentee_with_user)
    
    return result

async def get_mentee_by_id(mentee_id: str) -> Optional[MenteeWithUser]:
    collection = await get_mentees_collection()
    users_collection = await get_users_collection()
    
    mentee = await collection.find_one({"_id": ObjectId(mentee_id)})
    if not mentee:
        return None
    
    # Convertir l'ObjectId en chaîne de caractères
    mentee["_id"] = str(mentee["_id"])
    
    user = None
    if mentee.get("user_id"):
        user = await users_collection.find_one({"_id": ObjectId(mentee["user_id"])})
        if user:
            # Convertir l'ObjectId en chaîne de caractères
            user["_id"] = str(user["_id"])
            if "hashed_password" in user:
                del user["hashed_password"]
    
    mentee_with_user = MenteeWithUser(
        **mentee,
        user=user or {}
    )
    
    return mentee_with_user

async def get_mentee_by_user_id(user_id: str) -> Optional[MenteeInDB]:
    collection = await get_mentees_collection()
    mentee = await collection.find_one({"user_id": user_id})
    if not mentee:
        return None
    
    # Convertir l'ObjectId en chaîne de caractères
    mentee["_id"] = str(mentee["_id"])
    
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
    
    # Supprimer les champs vides
    mentee_data = {k: v for k, v in mentee_data.items() if v is not None}
    
    await collection.update_one(
        {"_id": ObjectId(mentee_id)},
        {"$set": mentee_data}
    )
    
    mentee = await collection.find_one({"_id": ObjectId(mentee_id)})
    if not mentee:
        return None
    
    return MenteeInDB(**mentee)

async def accept_mentee_request(mentee_id: str) -> Optional[MenteeInDB]:
    """
    Accepter une demande de mentorat.
    """
    return await update_mentee(mentee_id, {"status": "accepted"})

async def reject_mentee_request(mentee_id: str) -> Optional[MenteeInDB]:
    """
    Rejeter une demande de mentorat.
    """
    return await update_mentee(mentee_id, {"status": "rejected"})

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
