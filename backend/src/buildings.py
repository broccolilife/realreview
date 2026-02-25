from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from .models import Building, BuildingOut, Review, ReviewOut, User, get_db
from .auth import get_current_user
from .gate import has_full_access

router = APIRouter(prefix="/buildings", tags=["buildings"])

@router.get("", response_model=list[BuildingOut])
def list_buildings(
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius: float = Query(default=10.0),
    min_rating: Optional[float] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Building)
    if min_rating:
        q = q.filter(Building.avg_rating >= min_rating)
    # Simple bounding box if coords provided
    if lat is not None and lng is not None:
        delta = radius / 69.0  # rough miles to degrees
        q = q.filter(
            Building.lat.between(lat - delta, lat + delta),
            Building.lng.between(lng - delta, lng + delta),
        )
    return q.limit(200).all()

@router.get("/{building_id}")
def get_building(
    building_id: int,
    db: Session = Depends(get_db),
    token: Optional[str] = None,
):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    
    reviews = db.query(Review).filter(Review.building_id == building_id).order_by(Review.created_at.desc()).all()
    
    # Check gate access
    gated = True
    if token:
        try:
            from .auth import get_current_user, oauth2_scheme
            from .models import SessionLocal
            temp_db = SessionLocal()
            from jose import jwt
            from .config import settings
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            user = temp_db.query(User).filter(User.id == int(payload["sub"])).first()
            if user:
                gated = not has_full_access(user, temp_db)
            temp_db.close()
        except Exception:
            pass
    
    return {
        "building": BuildingOut.model_validate(building),
        "reviews": [ReviewOut.model_validate(r) for r in reviews],
        "gated": gated,
    }
