from fastapi import APIRouter, HTTPException
from .categories import SERVICE_TYPES, SERVICE_TYPE_KEYS, SERVICE_TYPE_COLORS

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("")
def get_all_categories():
    return {
        "service_types": SERVICE_TYPE_KEYS,
        "data": SERVICE_TYPES,
        "colors": SERVICE_TYPE_COLORS,
    }

@router.get("/{service_type}")
def get_categories_for_type(service_type: str):
    if service_type not in SERVICE_TYPES:
        raise HTTPException(status_code=404, detail=f"Unknown service type: {service_type}")
    return SERVICE_TYPES[service_type]
