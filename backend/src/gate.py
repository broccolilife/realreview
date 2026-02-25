from sqlalchemy.orm import Session
from datetime import datetime
from .models import User, VerifiedResidency, Review, BuildingUnlock, Building

def check_access(user: User, building_id: int, db: Session) -> dict:
    """Check if user can access a building's reviews. Returns access info dict."""
    # Subscribers always have access
    if user.subscription_tier == "pro":
        return {"access": True, "tier": user.tier, "credits": user.review_credits, "reason": "subscriber"}
    
    # Unlimited access (purchased with 50 RC)
    if user.unlimited_until and user.unlimited_until > datetime.utcnow():
        return {"access": True, "tier": user.tier, "credits": user.review_credits, "reason": "unlimited_pass"}
    
    # community_pillar or trusted_reviewer → free access
    if user.tier in ("community_pillar", "trusted_reviewer"):
        return {"access": True, "tier": user.tier, "credits": user.review_credits, "reason": "tier_access"}
    
    # Check building-specific unlock
    building_unlock = db.query(BuildingUnlock).filter(
        BuildingUnlock.user_id == user.id,
        BuildingUnlock.building_id == building_id,
        BuildingUnlock.unlock_type == "building",
    ).first()
    if building_unlock:
        return {"access": True, "tier": user.tier, "credits": user.review_credits, "reason": "building_unlocked"}
    
    # Check neighborhood unlock
    building = db.query(Building).filter(Building.id == building_id).first()
    if building:
        neighborhood_unlocks = db.query(BuildingUnlock).filter(
            BuildingUnlock.user_id == user.id,
            BuildingUnlock.unlock_type == "neighborhood",
        ).all()
        for nu in neighborhood_unlocks:
            if nu.lat and nu.lng and nu.radius:
                # Simple distance check (degrees)
                delta = nu.radius / 69.0
                if (abs(building.lat - nu.lat) <= delta and abs(building.lng - nu.lng) <= delta):
                    return {"access": True, "tier": user.tier, "credits": user.review_credits, "reason": "neighborhood_unlocked"}
    
    # verified_renter can spend RC
    if user.tier == "verified_renter":
        return {
            "access": False, "tier": user.tier, "credits": user.review_credits,
            "cost_to_unlock": 2, "reason": "spend_rc_to_unlock",
        }
    
    # new_tenant → blocked
    return {
        "access": False, "tier": user.tier, "credits": user.review_credits,
        "cost_to_unlock": 2, "reason": "submit_review_first",
    }

# Legacy compat
def has_full_access(user: User, db: Session) -> bool:
    if user.subscription_tier == "pro":
        return True
    if user.tier in ("community_pillar", "trusted_reviewer"):
        return True
    if user.unlimited_until and user.unlimited_until > datetime.utcnow():
        return True
    return False
