export interface User {
  id: number;
  email: string;
  is_verified: boolean;
  subscription_tier: string;
  review_credits: number;
  tier: string;
  reviews_count: number;
  login_streak: number;
}

export interface CreditTransaction {
  id: number;
  amount: number;
  reason: string;
  reference_id?: string;
  created_at: string;
}

export interface CreditBalance {
  credits: number;
  tier: string;
  login_streak: number;
  reviews_count: number;
  transactions: CreditTransaction[];
  next_tier?: string;
  credits_to_next_tier?: number;
  reviews_to_next_tier?: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  credits: number;
  tier: string;
  reviews_count: number;
}

export interface AccessInfo {
  access: boolean;
  tier: string;
  credits: number;
  cost_to_unlock?: number;
  reason: string;
}

export const TIER_BADGES: Record<string, string> = {
  new_tenant: '🥉',
  verified_renter: '🥈',
  trusted_reviewer: '🥇',
  community_pillar: '💎',
};

export const TIER_LABELS: Record<string, string> = {
  new_tenant: 'New Tenant',
  verified_renter: 'Verified Renter',
  trusted_reviewer: 'Trusted Reviewer',
  community_pillar: 'Community Pillar',
};

export type ServiceType = 'apartment' | 'restaurant' | 'hospital' | 'school' | 'workplace' | 'gym' | 'hotel';

export interface Building {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  avg_rating: number;
  review_count: number;
  service_type?: ServiceType;
  category_averages?: Record<string, number>;
}

export interface Review {
  id: number;
  user_id: number;
  building_id: number;
  overall_rating: number;
  service_type?: ServiceType;
  category_ratings?: Record<string, number>;
  // Legacy
  rating_management?: number;
  rating_maintenance?: number;
  rating_noise?: number;
  rating_pests?: number;
  rating_safety?: number;
  rating_amenities?: number;
  rating_neighbors?: number;
  rating_value?: number;
  pros: string[];
  cons: string[];
  text?: string;
  optional_fields?: Record<string, any>;
  rent_paid?: number;
  move_in_date?: string;
  move_out_date?: string;
  would_renew?: boolean;
  created_at: string;
  likes_count: number;
}

export interface Comment {
  id: number;
  user_id: number;
  review_id: number;
  text: string;
  created_at: string;
}

export interface ServiceTypeData {
  label: string;
  icon: string;
  categories: string[];
  yes_no_question: string;
  pro_tags: string[];
  con_tags: string[];
  optional_fields: { key: string; label: string; type: string }[];
}

export interface CategoriesResponse {
  service_types: ServiceType[];
  data: Record<ServiceType, ServiceTypeData>;
  colors: Record<ServiceType, string>;
}

// Legacy compat
export const CATEGORIES = [
  'management', 'maintenance', 'noise', 'pests',
  'safety', 'amenities', 'neighbors', 'value',
] as const;

export const PRO_TAGS = [
  'Quiet', 'Good Management', 'Clean', 'Safe', 'Great Location',
  'Pet Friendly', 'Good Amenities', 'Responsive Maintenance',
  'Nice Neighbors', 'Good Value', 'Natural Light', 'Spacious',
];

export const CON_TAGS = [
  'Noisy', 'Pest Issues', 'Slow Maintenance', 'Bad Management',
  'Unsafe Area', 'Dirty', 'Overpriced', 'Poor Amenities',
  'Thin Walls', 'Parking Issues', 'Bad Plumbing', 'No Laundry',
];

export const SERVICE_TYPE_ICONS: Record<ServiceType, string> = {
  apartment: '🏠',
  restaurant: '🍽️',
  hospital: '🏥',
  school: '🏫',
  workplace: '🏢',
  gym: '🏋️',
  hotel: '🏨',
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  apartment: 'Apartment/Rental',
  restaurant: 'Restaurant',
  hospital: 'Hospital/Clinic',
  school: 'School/University',
  workplace: 'Workplace',
  gym: 'Gym/Fitness',
  hotel: 'Hotel',
};

export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  apartment: '#6366f1',
  restaurant: '#f59e0b',
  hospital: '#ef4444',
  school: '#3b82f6',
  workplace: '#8b5cf6',
  gym: '#10b981',
  hotel: '#ec4899',
};
