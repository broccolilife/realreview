from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import create_tables
from .auth import router as auth_router
from .reviews import router as reviews_router
from .buildings import router as buildings_router
from .verification import router as verification_router

app = FastAPI(title="RealReview API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(reviews_router)
app.include_router(buildings_router)
app.include_router(verification_router)

@app.on_event("startup")
def startup():
    create_tables()

@app.get("/")
def root():
    return {"name": "RealReview API", "version": "0.1.0"}
