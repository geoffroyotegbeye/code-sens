from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from ...models.mentoring import (
    MentoringSessionCreate, 
    MentoringSessionInDB, 
    MentoringSessionUpdate,
    MentoringSessionWithMentee,
    AvailabilityCreate,
    AvailabilityInDB,
    AvailabilityUpdate,
    SpecificDateAvailabilityCreate,
    SpecificDateAvailabilityInDB,
    MenteeCreate,
    MenteeInDB,
    MenteeUpdate,
    MenteeWithUser,
    MentoringPricingCreate,
    MentoringPricingInDB,
    MentoringPricingUpdate
)
from ...services.mentoring_service import (
    # Sessions
    get_all_mentoring_sessions,
    get_all_mentoring_sessions_with_mentee,
    get_mentoring_session_by_id,
    get_mentoring_sessions_by_mentee_id,
    create_mentoring_session,
    update_mentoring_session,
    delete_mentoring_session,
    confirm_mentoring_session,
    cancel_mentoring_session,
    complete_mentoring_session,
    
    # Disponibilités
    get_all_weekly_availability,
    create_weekly_availability,
    update_weekly_availability,
    delete_weekly_availability,
    get_specific_date_availability,
    set_specific_date_availability,
    
    # Mentorés
    get_all_mentees,
    get_mentee_by_id,
    get_mentee_by_user_id,
    create_mentee,
    update_mentee,
    
    # Tarifs
    get_all_pricing,
    get_pricing_by_id,
    create_pricing,
    update_pricing,
    delete_pricing
)
from ...api.deps import get_current_user, get_optional_current_user
from ...models.user import UserInDB
from typing import Dict, Any

router = APIRouter()

# Routes pour les sessions de mentorat
@router.get("/sessions", response_model=List[MentoringSessionWithMentee])
async def read_mentoring_sessions(
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Récupérer toutes les sessions de mentorat.
    Nécessite des droits d'administrateur.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return await get_all_mentoring_sessions_with_mentee()

@router.get("/sessions/{session_id}", response_model=MentoringSessionWithMentee)
async def read_mentoring_session(
    session_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Récupérer une session de mentorat par son ID.
    """
    session = await get_mentoring_session_by_id(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    # Vérifier que l'utilisateur est admin ou le mentoré concerné
    if not current_user.is_admin:
        mentee = await get_mentee_by_user_id(str(current_user.id))
        if not mentee or str(mentee.id) != session.mentee_id:
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return session

@router.get("/sessions/mentee/{mentee_id}", response_model=List[MentoringSessionInDB])
async def read_mentoring_sessions_by_mentee(
    mentee_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Récupérer toutes les sessions de mentorat d'un mentoré.
    """
    # Vérifier que l'utilisateur est admin ou le mentoré concerné
    if not current_user.is_admin:
        mentee = await get_mentee_by_user_id(str(current_user.id))
        if not mentee or str(mentee.id) != mentee_id:
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return await get_mentoring_sessions_by_mentee_id(mentee_id)

@router.post("/sessions", response_model=MentoringSessionInDB)
async def create_session(
    session: MentoringSessionCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Créer une nouvelle session de mentorat.
    """
    # Vérifier que l'utilisateur est admin ou le mentoré concerné
    if not current_user.is_admin:
        mentee = await get_mentee_by_user_id(str(current_user.id))
        if not mentee or str(mentee.id) != session.mentee_id:
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return await create_mentoring_session(session.model_dump(by_alias=True))

@router.put("/sessions/{session_id}", response_model=MentoringSessionInDB)
async def update_session(
    session_id: str,
    session_update: MentoringSessionUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Mettre à jour une session de mentorat.
    """
    # Vérifier que la session existe
    existing_session = await get_mentoring_session_by_id(session_id)
    if not existing_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    updated_session = await update_mentoring_session(
        session_id,
        session_update.model_dump(exclude_unset=True)
    )
    
    if not updated_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    return updated_session

@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Supprimer une session de mentorat.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Vérifier que la session existe
    existing_session = await get_mentoring_session_by_id(session_id)
    if not existing_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    success = await delete_mentoring_session(session_id)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
    
    return {"message": "Session supprimée avec succès"}

@router.put("/sessions/{session_id}/confirm", response_model=MentoringSessionInDB)
async def confirm_session(
    session_id: str,
    data: dict,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Confirmer une session de mentorat.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Vérifier que la session existe
    existing_session = await get_mentoring_session_by_id(session_id)
    if not existing_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    meeting_url = data.get("meeting_url", "")
    updated_session = await confirm_mentoring_session(session_id, meeting_url)
    
    if not updated_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    return updated_session

@router.put("/sessions/{session_id}/cancel", response_model=MentoringSessionInDB)
async def cancel_session(
    session_id: str,
    data: dict,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Annuler une session de mentorat.
    """
    # Vérifier que la session existe
    existing_session = await get_mentoring_session_by_id(session_id)
    if not existing_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    # Vérifier que l'utilisateur est admin ou le mentoré concerné
    if not current_user.is_admin:
        mentee = await get_mentee_by_user_id(str(current_user.id))
        if not mentee or str(mentee.id) != existing_session.mentee_id:
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    reason = data.get("reason", "")
    updated_session = await cancel_mentoring_session(session_id, reason)
    
    if not updated_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    return updated_session

@router.put("/sessions/{session_id}/complete", response_model=MentoringSessionInDB)
async def complete_session(
    session_id: str,
    data: dict,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Marquer une session de mentorat comme terminée.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Vérifier que la session existe
    existing_session = await get_mentoring_session_by_id(session_id)
    if not existing_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    notes = data.get("notes", "")
    updated_session = await complete_mentoring_session(session_id, notes)
    
    if not updated_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    return updated_session

# Routes pour les disponibilités hebdomadaires
@router.get("/availability/weekly", response_model=List[AvailabilityInDB])
async def read_weekly_availability(
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    """
    Récupérer toutes les disponibilités hebdomadaires.
    """
    return await get_all_weekly_availability()

@router.post("/availability/weekly", response_model=AvailabilityInDB)
async def create_availability(
    availability: AvailabilityCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Créer une nouvelle disponibilité hebdomadaire.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return await create_weekly_availability(availability.model_dump(by_alias=True))

@router.put("/availability/weekly/{availability_id}", response_model=AvailabilityInDB)
async def update_availability(
    availability_id: str,
    availability_update: AvailabilityUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Mettre à jour une disponibilité hebdomadaire.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    updated_availability = await update_weekly_availability(
        availability_id,
        availability_update.model_dump(exclude_unset=True)
    )
    
    if not updated_availability:
        raise HTTPException(status_code=404, detail="Disponibilité non trouvée")
    
    return updated_availability

@router.delete("/availability/weekly/{availability_id}")
async def delete_availability(
    availability_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Supprimer une disponibilité hebdomadaire.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    success = await delete_weekly_availability(availability_id)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
    
    return {"message": "Disponibilité supprimée avec succès"}

# Routes pour les disponibilités à des dates spécifiques
@router.get("/availability/date/{date}", response_model=SpecificDateAvailabilityInDB)
async def read_specific_date_availability(
    date: str,
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    """
    Récupérer la disponibilité pour une date spécifique.
    """
    availability = await get_specific_date_availability(date)
    if not availability:
        raise HTTPException(status_code=404, detail="Disponibilité non trouvée pour cette date")
    
    return availability

@router.post("/availability/date", response_model=SpecificDateAvailabilityInDB)
async def set_availability_for_date(
    availability: SpecificDateAvailabilityCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Définir la disponibilité pour une date spécifique.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return await set_specific_date_availability(availability.model_dump(by_alias=True))

# Routes pour les mentorés
@router.get("/mentees", response_model=List[MenteeWithUser])
async def read_mentees(
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Récupérer tous les mentorés.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return await get_all_mentees()

@router.get("/mentees/{mentee_id}", response_model=MenteeWithUser)
async def read_mentee(
    mentee_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Récupérer un mentoré par son ID.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    mentee = await get_mentee_by_id(mentee_id)
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentoré non trouvé")
    
    return mentee

@router.get("/mentees/user/{user_id}", response_model=MenteeInDB)
async def read_mentee_by_user_id(
    user_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Récupérer un mentoré par l'ID de l'utilisateur.
    """
    # Vérifier que l'utilisateur est admin ou l'utilisateur concerné
    if not current_user.is_admin and str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    mentee = await get_mentee_by_user_id(user_id)
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentoré non trouvé")
    
    return mentee

@router.post("/mentees", response_model=MenteeInDB)
async def create_mentee_profile(
    mentee: MenteeCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Créer un profil de mentoré.
    """
    # Vérifier que l'utilisateur est admin ou l'utilisateur concerné
    if not current_user.is_admin and str(current_user.id) != mentee.user_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Vérifier si un profil existe déjà pour cet utilisateur
    existing_mentee = await get_mentee_by_user_id(mentee.user_id)
    if existing_mentee:
        raise HTTPException(status_code=400, detail="Un profil de mentoré existe déjà pour cet utilisateur")
    
    return await create_mentee(mentee.model_dump(by_alias=True))

@router.put("/mentees/{mentee_id}", response_model=MenteeInDB)
async def update_mentee_profile(
    mentee_id: str,
    mentee_update: MenteeUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Mettre à jour un profil de mentoré.
    """
    # Vérifier que le mentoré existe
    existing_mentee = await get_mentee_by_id(mentee_id)
    if not existing_mentee:
        raise HTTPException(status_code=404, detail="Mentoré non trouvé")
    
    # Vérifier que l'utilisateur est admin ou l'utilisateur concerné
    if not current_user.is_admin and str(current_user.id) != existing_mentee.user_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    updated_mentee = await update_mentee(
        mentee_id,
        mentee_update.model_dump(exclude_unset=True)
    )
    
    if not updated_mentee:
        raise HTTPException(status_code=404, detail="Mentoré non trouvé")
    
    return updated_mentee

# Routes pour les tarifs
@router.get("/pricing", response_model=List[MentoringPricingInDB])
async def read_pricing(
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    """
    Récupérer tous les tarifs.
    """
    return await get_all_pricing()

@router.get("/pricing/{pricing_id}", response_model=MentoringPricingInDB)
async def read_pricing_by_id(
    pricing_id: str,
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    """
    Récupérer un tarif par son ID.
    """
    pricing = await get_pricing_by_id(pricing_id)
    if not pricing:
        raise HTTPException(status_code=404, detail="Tarif non trouvé")
    
    return pricing

@router.post("/pricing", response_model=MentoringPricingInDB)
async def create_pricing_option(
    pricing: MentoringPricingCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Créer un nouveau tarif.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return await create_pricing(pricing.model_dump(by_alias=True))

@router.put("/pricing/{pricing_id}", response_model=MentoringPricingInDB)
async def update_pricing_option(
    pricing_id: str,
    pricing_update: MentoringPricingUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Mettre à jour un tarif.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    updated_pricing = await update_pricing(
        pricing_id,
        pricing_update.model_dump(exclude_unset=True)
    )
    
    if not updated_pricing:
        raise HTTPException(status_code=404, detail="Tarif non trouvé")
    
    return updated_pricing

@router.delete("/pricing/{pricing_id}")
async def delete_pricing_option(
    pricing_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Supprimer un tarif.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    success = await delete_pricing(pricing_id)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
    
    return {"message": "Tarif supprimé avec succès"}

# Routes pour la visioconférence
@router.post("/videocall/create-room")
async def create_videocall_room(
    data: dict,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Créer une nouvelle salle de visioconférence.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    session_id = data.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="ID de session requis")
    
    # Vérifier que la session existe
    session = await get_mentoring_session_by_id(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    # Ici, vous pourriez intégrer un service de visioconférence comme Twilio, Agora, etc.
    # Pour l'instant, nous retournons simplement un ID de salle fictif
    room_id = f"room_{session_id}"
    room_url = f"https://meet.example.com/{room_id}"
    
    return {"roomId": room_id, "roomUrl": room_url}

@router.post("/videocall/join-room")
async def join_videocall_room(
    data: dict,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Rejoindre une salle de visioconférence.
    """
    room_id = data.get("room_id")
    if not room_id:
        raise HTTPException(status_code=400, detail="ID de salle requis")
    
    # Ici, vous pourriez générer un token pour le service de visioconférence
    # Pour l'instant, nous retournons simplement un token fictif
    token = f"token_{room_id}_{current_user.id}"
    
    return {"token": token}

@router.post("/videocall/end-room")
async def end_videocall_room(
    data: dict,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Terminer une salle de visioconférence.
    """
    # Vérifier que l'utilisateur est admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    room_id = data.get("room_id")
    if not room_id:
        raise HTTPException(status_code=400, detail="ID de salle requis")
    
    # Ici, vous pourriez terminer la salle dans le service de visioconférence
    
    return {"message": "Salle terminée avec succès"}
