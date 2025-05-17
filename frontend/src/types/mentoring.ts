export interface MentoringSession {
  id: string;
  mentee_id?: string; // Pour rétrocompatibilité
  mentee_ids?: string[]; // Nouveau champ pour plusieurs mentorés
  mentees?: Mentee[]; // Pour stocker les données complètes des mentorés
  title: string;
  description: string;
  date: string;
  duration: number; // Durée en minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
  pricing_id: string;
  meeting_url?: string;
  cancellation_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MentoringSessionCreate {
  mentee_id?: string; // Pour rétrocompatibilité
  mentee_ids: string[]; // Liste d'IDs de mentorés
  date: string;
  duration: number; // Durée en minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
  pricing_id: string;
  meeting_url?: string;
  cancellation_reason?: string;
}

export interface MentoringSessionUpdate {
  title?: string;
  description?: string;
  date?: string;
  duration?: number; // Durée en minutes
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price?: number;
  pricing_id?: string;
  meeting_url?: string;
  cancellation_reason?: string;
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
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  goals?: string;
  skills_to_improve?: string[];
  interests?: string[];
  status?: 'pending' | 'accepted' | 'rejected'; // Ajout du statut
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
