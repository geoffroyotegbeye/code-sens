from fastapi import APIRouter, Depends
from ...core.auth import get_current_admin_user

router = APIRouter()

@router.get("/")
async def get_payments(current_user = Depends(get_current_admin_user)):
    return {"message": "Liste des paiements"} 