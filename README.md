# RealReview 🏠

**Verified apartment reviews you can actually trust.**

RealReview is a web app where renters share honest reviews of their apartments — but only after proving they actually lived there. No fake reviews. No landlord astroturfing. Just real experiences from verified tenants.

## Why RealReview?

Apartment hunting is broken. Reviews on Google and Yelp are easily faked, and landlords game the system. RealReview fixes this with **document-verified residency** — upload a lease or utility bill, we confirm you lived there, then you can review.

## 🔒 Privacy-First

- **Documents are deleted immediately** after verification — we extract only the address and dates
- **No names stored** from documents
- **Email is hashed** at rest
- **You control your data** — delete your account and everything goes with it

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React, Tailwind CSS, Leaflet/OpenStreetMap |
| Backend | FastAPI, SQLAlchemy, SQLite (MVP), pytesseract |
| Auth | JWT (email + password) |
| Map | Leaflet + OpenStreetMap (free, no API key) |

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn src.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. **Sign up** with email + password
2. **Verify** your address by uploading a lease, rent receipt, or utility bill
3. **Review** your apartment with detailed category ratings
4. **Read** other verified reviews — give a review to get access, or subscribe

## Give-and-Take Model

To read reviews, you either:
- ✅ Verify your address and leave a review (free)
- 💳 Subscribe for $4.99/mo

This ensures every reader is also a contributor, keeping the review pool growing and honest.

## License

MIT
