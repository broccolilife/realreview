from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from .models import (
    User, Review, ReviewCreate, ReviewOut, ReviewLike, ReviewComment,
    CommentCreate, CommentOut, Building, VerifiedResidency, get_db,
)
from .auth import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("", response_model=ReviewOut)
def create_review(
    data: ReviewCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Must have verified residency
    if not db.query(VerifiedResidency).filter(VerifiedResidency.user_id == user.id).first():
        raise HTTPException(status_code=403, detail="You must verify your residency before reviewing")
    
    building = db.query(Building).filter(Building.id == data.building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    
    review = Review(user_id=user.id, **data.model_dump())
    db.add(review)
    db.commit()
    
    # Update building stats + category averages
    stats = db.query(
        func.avg(Review.overall_rating),
        func.count(Review.id),
    ).filter(Review.building_id == building.id).first()
    building.avg_rating = round(float(stats[0] or 0), 2)
    building.review_count = int(stats[1] or 0)
    
    # Recompute category averages from all reviews with category_ratings
    all_reviews = db.query(Review).filter(Review.building_id == building.id).all()
    cat_sums: dict = {}
    cat_counts: dict = {}
    for rev in all_reviews:
        cr = rev.category_ratings or {}
        for cat, val in cr.items():
            if isinstance(val, (int, float)) and val > 0:
                cat_sums[cat] = cat_sums.get(cat, 0) + val
                cat_counts[cat] = cat_counts.get(cat, 0) + 1
    building.category_averages = {c: round(cat_sums[c] / cat_counts[c], 2) for c in cat_sums}
    
    # Always apartment for MVP
    building.service_type = "apartment"
    
    db.commit()
    db.refresh(review)
    return review

@router.post("/{review_id}/like")
def like_review(
    review_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    existing = db.query(ReviewLike).filter(
        ReviewLike.user_id == user.id, ReviewLike.review_id == review_id
    ).first()
    if existing:
        db.delete(existing)
        review.likes_count = max(0, (review.likes_count or 0) - 1)
    else:
        db.add(ReviewLike(user_id=user.id, review_id=review_id))
        review.likes_count = (review.likes_count or 0) + 1
    db.commit()
    return {"likes_count": review.likes_count}

@router.get("/{review_id}/comments", response_model=list[CommentOut])
def get_comments(review_id: int, db: Session = Depends(get_db)):
    return db.query(ReviewComment).filter(ReviewComment.review_id == review_id).order_by(ReviewComment.created_at).all()

@router.post("/{review_id}/comments", response_model=CommentOut)
def create_comment(
    review_id: int,
    data: CommentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not db.query(Review).filter(Review.id == review_id).first():
        raise HTTPException(status_code=404, detail="Review not found")
    comment = ReviewComment(user_id=user.id, review_id=review_id, text=data.text)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
