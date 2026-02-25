import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from .config import settings
from .models import User, VerifiedResidency, Building, get_db
from .auth import get_current_user
from .ocr import process_document
from .privacy import delete_file

router = APIRouter(prefix="/verify", tags=["verification"])

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    os.makedirs(settings.upload_dir, exist_ok=True)
    ext = os.path.splitext(file.filename or "doc.png")[1]
    tmp_path = os.path.join(settings.upload_dir, f"{uuid.uuid4()}{ext}")
    
    try:
        with open(tmp_path, "wb") as f:
            f.write(file.file.read())
        
        result = process_document(tmp_path)
        if not result:
            raise HTTPException(status_code=422, detail="Could not extract address from document")
        
        # Create or find building
        building = db.query(Building).filter(
            Building.address == result["address"],
            Building.zip == result["zip"],
        ).first()
        if not building:
            building = Building(
                address=result["address"],
                city=result["city"],
                state=result["state"],
                zip=result["zip"],
                lat=0.0, lng=0.0,  # Geocoding TODO
            )
            db.add(building)
            db.commit()
            db.refresh(building)
        
        residency = VerifiedResidency(
            user_id=user.id,
            address=result["address"],
            city=result["city"],
            state=result["state"],
            zip=result["zip"],
            move_in_date=result.get("move_in_date"),
            move_out_date=result.get("move_out_date"),
        )
        db.add(residency)
        user.is_verified = True
        db.commit()
        
        return {
            "status": "verified",
            "address": result["address"],
            "city": result["city"],
            "state": result["state"],
            "zip": result["zip"],
            "building_id": building.id,
        }
    finally:
        delete_file(tmp_path)
