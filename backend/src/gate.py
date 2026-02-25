from sqlalchemy.orm import Session
from .models import User, VerifiedResidency, Review

def has_full_access(user: User, db: Session) -> bool:
    """Check if user has full access to read reviews."""
    if user.subscription_tier == "pro":
        return True
    # Must have at least one verified residency AND one review
    has_residency = db.query(VerifiedResidency).filter(VerifiedResidency.user_id == user.id).first()
    has_review = db.query(Review).filter(Review.user_id == user.id).first()
    return bool(has_residency and has_review)
