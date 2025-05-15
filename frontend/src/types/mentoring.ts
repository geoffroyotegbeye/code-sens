export interface MentoringSession {
  _id: string;
  mentee_id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  meeting_url?: string;
  notes?: string;
  price: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface MentoringSessionCreate {
  mentee_id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
}

export interface MentoringSessionUpdate {
  title?: string;
  description?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  meeting_url?: string;
  notes?: string;
  price?: number;
  payment_status?: 'pending' | 'paid' | 'refunded';
}

export interface Availability {
  _id: string;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Dimanche, 1 = Lundi, etc.
  start_time: string; // Format: "HH:MM"
  end_time: string; // Format: "HH:MM"
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityCreate {
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AvailabilityUpdate {
  start_time?: string;
  end_time?: string;
  is_available?: boolean;
}

export interface SpecificDateAvailability {
  _id: string;
  date: string; // Format: "YYYY-MM-DD"
  is_available: boolean;
  available_slots?: {
    start_time: string;
    end_time: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface Mentee {
  _id: string;
  user_id: string;
  full_name: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  goals?: string;
  skills_level?: 'beginner' | 'intermediate' | 'advanced';
  interests?: string[];
  sessions_count: number;
  total_session_time: number; // en minutes
  created_at: string;
  updated_at: string;
}

export interface MentoringPricing {
  _id: string;
  duration: number; // en minutes
  price: number;
  currency: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentoringPricingCreate {
  duration: number;
  price: number;
  currency: string;
  description: string;
  is_active: boolean;
}

export interface MentoringPricingUpdate {
  duration?: number;
  price?: number;
  currency?: string;
  description?: string;
  is_active?: boolean;
}
