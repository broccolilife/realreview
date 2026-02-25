export interface User {
  id: number;
  email: string;
  is_verified: boolean;
  subscription_tier: string;
}

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
}

export interface Review {
  id: number;
  user_id: number;
  building_id: number;
  overall_rating: number;
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
