from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta

from .models import (
    User, CreditTransaction, BuildingUnlock, Building,
    CreditBalanceOut, CreditTransactionOut, LeaderboardEntry, get_db,
)
from .auth import get_current_user

router = APIRouter(prefix="/credits", tags=["credits"])

# ── Tier definitions ──

TIERS = [
    ("new_tenant", 0, 0),
    ("verified_renter", 10, 1),
    ("trusted_reviewer", 50, 3),
    ("community_pillar", 200, 10),
]

def compute_tier(credits: int, reviews_count: int) -> str:
    tier = "new_tenant"
    for name, min_credits, min_reviews in TIERS:
        if credits >= min_credits and reviews_count >= min_reviews:
            tier = name
    return tier

def next_tier_info(credits: int, reviews_count: int):
    current_idx = 0
    for i, (name, mc, mr) in enumerate(TIERS):
        if credits >= mc and reviews_count >= mr:
            current_idx = i
    if current_idx >= len(TIERS) - 1:
        return None, None, None
    next_name, next_c, next_r = TIERS[current_idx + 1]
    return next_name, max(0, next_c - credits), max(0, next_r - reviews_count)

def update_tier(user: User):
    user.tier = compute_tier(user.review_credits, user.reviews_count)

def add_credits(db: Session, user: User, amount: int, reason: str, reference_id: str = None):
    user.review_credits += amount
    update_tier(user)
    tx = CreditTransaction(user_id=user.id, amount=amount, reason=reason, reference_id=reference_id)
    db.add(tx)

# ── Award functions (called from other modules) ──

def award_review_submitted(db: Session, user: User, review_id: int):
    add_credits(db, user, 10, "review_submitted", str(review_id))
    user.reviews_count += 1
    update_tier(user)

def award_photo_added(db: Session, user: User, review_id: int):
    add_credits(db, user, 2, "photo_added", str(review_id))

def award_comment(db: Session, user: User, comment_id: int):
    add_credits(db, user, 1, "helpful_comment", str(comment_id))

def award_referral(db: Session, user: User, referred_user_id: int):
    add_credits(db, user, 5, "referral", str(referred_user_id))

def check_like_bonuses(db: Session, review_user: User, review_id: int, likes_count: int):
    """Check and award one-time like bonuses."""
    if likes_count >= 5:
        existing = db.query(CreditTransaction).filter(
            CreditTransaction.user_id == review_user.id,
            CreditTransaction.reason == "likes_5_bonus",
            CreditTransaction.reference_id == str(review_id),
        ).first()
        if not existing:
            add_credits(db, review_user, 3, "likes_5_bonus", str(review_id))
    if likes_count >= 10:
        existing = db.query(CreditTransaction).filter(
            CreditTransaction.user_id == review_user.id,
            CreditTransaction.reason == "likes_10_bonus",
            CreditTransaction.reference_id == str(review_id),
        ).first()
        if not existing:
            add_credits(db, review_user, 5, "likes_10_bonus", str(review_id))

# ── Endpoints ──

@router.get("/balance", response_model=CreditBalanceOut)
def get_balance(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    txs = db.query(CreditTransaction).filter(
        CreditTransaction.user_id == user.id
    ).order_by(CreditTransaction.created_at.desc()).limit(50).all()
    
    next_name, credits_needed, reviews_needed = next_tier_info(user.review_credits, user.reviews_count)
    
    return CreditBalanceOut(
        credits=user.review_credits,
        tier=user.tier,
        login_streak=user.login_streak,
        reviews_count=user.reviews_count,
        transactions=[CreditTransactionOut.model_validate(t) for t in txs],
        next_tier=next_name,
        credits_to_next_tier=credits_needed,
        reviews_to_next_tier=reviews_needed,
    )

@router.post("/daily-login")
def daily_login(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    if user.last_login_date == today:
        return {"message": "Already claimed today", "streak": user.login_streak, "credits": user.review_credits}
    
    if user.last_login_date == today - timedelta(days=1):
        user.login_streak += 1
    else:
        user.login_streak = 1
    
    user.last_login_date = today
    
    # Streak bonus at 7 days
    bonus = 0
    if user.login_streak % 7 == 0:
        bonus = 3
        add_credits(db, user, 3, "streak_7_bonus", f"streak_{user.login_streak}")
    
    db.commit()
    return {
        "message": "Daily login claimed!",
        "streak": user.login_streak,
        "credits": user.review_credits,
        "bonus": bonus,
    }

@router.post("/unlock-building/{building_id}")
def unlock_building(
    building_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check if already unlocked
    existing = db.query(BuildingUnlock).filter(
        BuildingUnlock.user_id == user.id,
        BuildingUnlock.building_id == building_id,
        BuildingUnlock.unlock_type == "building",
    ).first()
    if existing:
        return {"message": "Already unlocked", "credits": user.review_credits}
    
    if user.review_credits < 2:
        raise HTTPException(status_code=402, detail="Not enough credits. Need 2 RC.")
    
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    
    add_credits(db, user, -2, "unlock_building", str(building_id))
    db.add(BuildingUnlock(user_id=user.id, building_id=building_id, unlock_type="building"))
    db.commit()
    return {"message": "Building unlocked!", "credits": user.review_credits}

@router.post("/unlock-neighborhood")
def unlock_neighborhood(
    lat: float, lng: float, radius: float = 0.5,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.review_credits < 10:
        raise HTTPException(status_code=402, detail="Not enough credits. Need 10 RC.")
    
    add_credits(db, user, -10, "unlock_neighborhood", f"{lat},{lng},{radius}")
    db.add(BuildingUnlock(
        user_id=user.id, unlock_type="neighborhood",
        lat=lat, lng=lng, radius=radius,
    ))
    db.commit()
    return {"message": "Neighborhood unlocked!", "credits": user.review_credits}

@router.post("/unlock-unlimited")
def unlock_unlimited(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.review_credits < 50:
        raise HTTPException(status_code=402, detail="Not enough credits. Need 50 RC.")
    
    expires = datetime.utcnow() + timedelta(days=30)
    add_credits(db, user, -50, "unlock_unlimited_30d")
    user.unlimited_until = expires
    db.add(BuildingUnlock(user_id=user.id, unlock_type="unlimited", expires_at=expires))
    db.commit()
    return {"message": "30-day unlimited access!", "credits": user.review_credits, "expires": expires.isoformat()}

@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.review_credits.desc()).limit(20).all()
    results = []
    for i, u in enumerate(users):
        # Anonymous username from email
        name = u.email.split("@")[0]
        if len(name) > 2:
            name = name[0] + "*" * (len(name) - 2) + name[-1]
        results.append(LeaderboardEntry(
            rank=i + 1, username=name, credits=u.review_credits,
            tier=u.tier, reviews_count=u.reviews_count,
        ))
    return results
