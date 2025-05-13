from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form, Request
from fastapi.responses import JSONResponse
from typing import Optional
from ...services.upload_service import save_upload_file
from ...api.deps import get_current_user, get_optional_current_user
from ...models.user import User

router = APIRouter()

@router.post("/image", response_model=dict)
async def upload_image(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Télécharge une image et retourne son URL
    """
    # Vérifier que le fichier est bien une image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image")
    
    # Sauvegarder l'image
    file_path = await save_upload_file(file)
    
    # Retourner l'URL de l'image
    return {"url": file_path}
