"""Service types and their dynamic rating categories, pro/con tags, and optional fields."""

from typing import Any

SERVICE_TYPES = {
    "apartment": {
        "label": "Apartment/Rental",
        "icon": "🏠",
        "categories": [
            "Cleanliness",
            "Safety",
            "Noise level",
            "Pest control",
            "Management responsiveness",
            "Maintenance quality",
            "Amenities accuracy",
            "Parking",
            "Natural light",
            "Neighbors",
            "Value for money",
        ],
        "yes_no_question": "Would you renew?",
        "pro_tags": [
            "Quiet", "Clean", "Good management", "Safe area",
            "Natural light", "Pet-friendly", "Good parking",
        ],
        "con_tags": [
            "Noisy", "Pests", "Slow maintenance", "Bad management",
            "Unsafe area", "No parking", "Dark rooms",
        ],
        "optional_fields": [
            {"key": "rent_paid", "label": "Monthly rent ($)", "type": "number"},
            {"key": "move_in_date", "label": "Move-in date", "type": "text"},
            {"key": "move_out_date", "label": "Move-out date", "type": "text"},
            {"key": "floor_number", "label": "Floor number", "type": "number"},
            {"key": "unit_size_sqft", "label": "Unit size (sq ft)", "type": "number"},
            {"key": "lease_length", "label": "Lease length (e.g., 12 months)", "type": "text"},
            {"key": "rent_increased", "label": "Did rent increase at renewal?", "type": "boolean"},
            {"key": "utility_cost", "label": "Average monthly utility cost ($)", "type": "number"},
        ],
    },
    "restaurant": {
        "label": "Restaurant",
        "icon": "🍽️",
        "categories": [
            "Food quality",
            "Service/staff",
            "Cleanliness",
            "Wait time",
            "Ambiance/vibe",
            "Portion size",
            "Value for money",
            "Accessibility",
        ],
        "yes_no_question": "Would you return?",
        "pro_tags": [
            "Delicious food", "Fast service", "Cozy vibe",
            "Great portions", "Friendly staff",
        ],
        "con_tags": [
            "Slow service", "Overpriced", "Small portions",
            "Dirty", "Rude staff",
        ],
        "optional_fields": [
            {"key": "meal_cost", "label": "Average meal cost ($)", "type": "number"},
        ],
    },
    "hospital": {
        "label": "Hospital/Clinic",
        "icon": "🏥",
        "categories": [
            "Staff friendliness",
            "Wait time",
            "Cleanliness",
            "Quality of care",
            "Communication",
            "Billing transparency",
            "Parking/accessibility",
            "Follow-up care",
        ],
        "yes_no_question": "Would you return?",
        "pro_tags": [
            "Friendly staff", "Short wait", "Clean facility",
            "Great doctors", "Clear communication",
        ],
        "con_tags": [
            "Long wait", "Rude staff", "Unclear billing",
            "Poor follow-up", "Dirty",
        ],
        "optional_fields": [],
    },
    "school": {
        "label": "School/University",
        "icon": "🏫",
        "categories": [
            "Teaching quality",
            "Campus safety",
            "Facilities",
            "Administration responsiveness",
            "Student life",
            "Career services",
            "Value for tuition",
            "Diversity/inclusion",
        ],
        "yes_no_question": "Would you recommend?",
        "pro_tags": [
            "Great professors", "Active campus life", "Good facilities",
            "Strong career services", "Diverse community",
        ],
        "con_tags": [
            "Poor teaching", "Unsafe campus", "Bad administration",
            "Overpriced tuition", "No career support",
        ],
        "optional_fields": [
            {"key": "tuition_paid", "label": "Annual tuition ($)", "type": "number"},
            {"key": "graduation_year", "label": "Graduation year", "type": "text"},
        ],
    },
    "workplace": {
        "label": "Workplace",
        "icon": "🏢",
        "categories": [
            "Work-life balance",
            "Management quality",
            "Compensation fairness",
            "Growth opportunities",
            "Office environment",
            "Team culture",
            "Diversity/inclusion",
            "Benefits",
        ],
        "yes_no_question": "Would you work here again?",
        "pro_tags": [
            "Great culture", "Good pay", "Growth opportunities",
            "Work-life balance", "Supportive management",
        ],
        "con_tags": [
            "Poor management", "Low pay", "No growth",
            "Toxic culture", "Bad work-life balance",
        ],
        "optional_fields": [
            {"key": "role_title", "label": "Your role/title", "type": "text"},
            {"key": "years_worked", "label": "Years worked", "type": "number"},
        ],
    },
    "gym": {
        "label": "Gym/Fitness",
        "icon": "🏋️",
        "categories": [
            "Equipment quality",
            "Cleanliness",
            "Crowdedness",
            "Staff helpfulness",
            "Class variety",
            "Locker rooms",
            "Parking",
            "Value for money",
        ],
        "yes_no_question": "Would you renew?",
        "pro_tags": [
            "Great equipment", "Clean", "Good classes",
            "Friendly staff", "Never crowded",
        ],
        "con_tags": [
            "Dirty", "Always crowded", "Old equipment",
            "Rude staff", "Overpriced",
        ],
        "optional_fields": [
            {"key": "monthly_cost", "label": "Monthly membership ($)", "type": "number"},
        ],
    },
    "hotel": {
        "label": "Hotel",
        "icon": "🏨",
        "categories": [
            "Room cleanliness",
            "Staff friendliness",
            "Check-in/out ease",
            "Noise level",
            "Amenities",
            "Location",
            "WiFi quality",
            "Value for money",
        ],
        "yes_no_question": "Would you stay again?",
        "pro_tags": [
            "Spotless rooms", "Friendly staff", "Great location",
            "Easy check-in", "Fast WiFi",
        ],
        "con_tags": [
            "Dirty rooms", "Rude staff", "Noisy",
            "Bad location", "Slow WiFi",
        ],
        "optional_fields": [
            {"key": "nightly_rate", "label": "Nightly rate ($)", "type": "number"},
            {"key": "nights_stayed", "label": "Nights stayed", "type": "number"},
        ],
    },
}

SERVICE_TYPE_KEYS = list(SERVICE_TYPES.keys())

# Pin colors per service type (for frontend)
SERVICE_TYPE_COLORS = {
    "apartment": "#6366f1",  # indigo
    "restaurant": "#f59e0b",  # amber
    "hospital": "#ef4444",  # red
    "school": "#3b82f6",  # blue
    "workplace": "#8b5cf6",  # violet
    "gym": "#10b981",  # emerald
    "hotel": "#ec4899",  # pink
}
