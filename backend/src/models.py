from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.sql import func
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

from .config import settings

engine = create_engine(settings.database_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ── SQLAlchemy Models ──

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    is_verified = Column(Boolean, default=False)
    subscription_tier = Column(String, default="free")  # free | pro
    reviews = relationship("Review", back_populates="user")
    residencies = relationship("VerifiedResidency", back_populates="user")

class VerifiedResidency(Base):
    __tablename__ = "verified_residencies"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip = Column(String, nullable=False)
    verified_at = Column(DateTime, server_default=func.now())
    move_in_date = Column(String)
    move_out_date = Column(String)
    user = relationship("User", back_populates="residencies")

class Building(Base):
    __tablename__ = "buildings"
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    avg_rating = Column(Float, default=0)
    review_count = Column(Integer, default=0)
    reviews = relationship("Review", back_populates="building")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    overall_rating = Column(Integer, nullable=False)
    rating_management = Column(Integer)
    rating_maintenance = Column(Integer)
    rating_noise = Column(Integer)
    rating_pests = Column(Integer)
    rating_safety = Column(Integer)
    rating_amenities = Column(Integer)
    rating_neighbors = Column(Integer)
    rating_value = Column(Integer)
    pros = Column(JSON, default=[])
    cons = Column(JSON, default=[])
    text = Column(Text)
    rent_paid = Column(Integer)
    move_in_date = Column(String)
    move_out_date = Column(String)
    would_renew = Column(Boolean)
    created_at = Column(DateTime, server_default=func.now())
    likes_count = Column(Integer, default=0)
    user = relationship("User", back_populates="reviews")
    building = relationship("Building", back_populates="reviews")

class ReviewLike(Base):
    __tablename__ = "review_likes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)

class ReviewComment(Base):
    __tablename__ = "review_comments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

# ── Pydantic Schemas ──

class UserCreate(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    is_verified: bool
    subscription_tier: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ReviewCreate(BaseModel):
    building_id: int
    overall_rating: int
    rating_management: Optional[int] = None
    rating_maintenance: Optional[int] = None
    rating_noise: Optional[int] = None
    rating_pests: Optional[int] = None
    rating_safety: Optional[int] = None
    rating_amenities: Optional[int] = None
    rating_neighbors: Optional[int] = None
    rating_value: Optional[int] = None
    pros: List[str] = []
    cons: List[str] = []
    text: Optional[str] = None
    rent_paid: Optional[int] = None
    move_in_date: Optional[str] = None
    move_out_date: Optional[str] = None
    would_renew: Optional[bool] = None

class ReviewOut(BaseModel):
    id: int
    user_id: int
    building_id: int
    overall_rating: int
    rating_management: Optional[int]
    rating_maintenance: Optional[int]
    rating_noise: Optional[int]
    rating_pests: Optional[int]
    rating_safety: Optional[int]
    rating_amenities: Optional[int]
    rating_neighbors: Optional[int]
    rating_value: Optional[int]
    pros: List[str]
    cons: List[str]
    text: Optional[str]
    rent_paid: Optional[int]
    move_in_date: Optional[str]
    move_out_date: Optional[str]
    would_renew: Optional[bool]
    created_at: datetime
    likes_count: int
    class Config:
        from_attributes = True

class BuildingOut(BaseModel):
    id: int
    address: str
    city: str
    state: str
    zip: str
    lat: float
    lng: float
    avg_rating: float
    review_count: int
    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    text: str

class CommentOut(BaseModel):
    id: int
    user_id: int
    review_id: int
    text: str
    created_at: datetime
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
