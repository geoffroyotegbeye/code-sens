from bson import ObjectId
from typing import Any, Annotated
from pydantic import BeforeValidator, PlainSerializer

# Fonction de validation pour convertir les chaînes en ObjectId
def validate_object_id(v: Any) -> ObjectId:
    if isinstance(v, ObjectId):
        return v
    if isinstance(v, str):
        try:
            return ObjectId(v)
        except Exception:
            raise ValueError(f"Invalid ObjectId: {v}")
    raise ValueError(f"Value {v} cannot be converted to ObjectId")

# Fonction de sérialisation pour convertir les ObjectId en chaînes
def serialize_object_id(obj_id: ObjectId) -> str:
    return str(obj_id)

# Type annoté pour utiliser dans les modèles Pydantic
PyObjectId = Annotated[
    ObjectId,
    BeforeValidator(validate_object_id),
    PlainSerializer(serialize_object_id, return_type=str)
]
