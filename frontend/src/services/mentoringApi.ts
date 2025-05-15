import { getAuthHeader } from '../utils/auth';
import { 
  MentoringSession, 
  MentoringSessionCreate, 
  MentoringSessionUpdate,
  Availability,
  AvailabilityCreate,
  AvailabilityUpdate,
  SpecificDateAvailability,
  Mentee,
  MentoringPricing,
  MentoringPricingCreate,
  MentoringPricingUpdate
} from '../types/mentoring';

const API_URL = 'http://localhost:8000/api/v1';

// Helper function for making API requests
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || getAuthHeader());
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  // Pour les requêtes DELETE qui peuvent ne pas retourner de contenu
  if (response.status === 204) {
    return {} as T;
  }
  
  return await response.json();
}

// Sessions de mentorat
export const mentoringSessionsApi = {
  // Récupérer toutes les sessions
  getAllSessions: async (): Promise<MentoringSession[]> => {
    return fetchApi<MentoringSession[]>('/mentoring/sessions');
  },

  // Récupérer une session par son ID
  getSessionById: async (id: string): Promise<MentoringSession> => {
    return fetchApi<MentoringSession>(`/mentoring/sessions/${id}`);
  },

  // Récupérer les sessions d'un mentoré
  getSessionsByMenteeId: async (menteeId: string): Promise<MentoringSession[]> => {
    return fetchApi<MentoringSession[]>(`/mentoring/sessions/mentee/${menteeId}`);
  },

  // Créer une nouvelle session
  createSession: async (sessionData: MentoringSessionCreate): Promise<MentoringSession> => {
    return fetchApi<MentoringSession>('/mentoring/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  },

  // Mettre à jour une session
  updateSession: async (id: string, sessionData: MentoringSessionUpdate): Promise<MentoringSession> => {
    return fetchApi<MentoringSession>(`/mentoring/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData)
    });
  },

  // Supprimer une session
  deleteSession: async (id: string): Promise<void> => {
    await fetchApi<void>(`/mentoring/sessions/${id}`, {
      method: 'DELETE'
    });
  },

  // Confirmer une session
  confirmSession: async (id: string, meetingUrl: string): Promise<MentoringSession> => {
    return fetchApi<MentoringSession>(`/mentoring/sessions/${id}/confirm`, {
      method: 'PUT',
      body: JSON.stringify({ meeting_url: meetingUrl })
    });
  },

  // Annuler une session
  cancelSession: async (id: string, reason: string): Promise<MentoringSession> => {
    return fetchApi<MentoringSession>(`/mentoring/sessions/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  },

  // Marquer une session comme terminée
  completeSession: async (id: string, notes: string): Promise<MentoringSession> => {
    return fetchApi<MentoringSession>(`/mentoring/sessions/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ notes })
    });
  }
};

// Disponibilités
export const availabilityApi = {
  // Récupérer toutes les disponibilités hebdomadaires
  getWeeklyAvailability: async (): Promise<Availability[]> => {
    return fetchApi<Availability[]>('/mentoring/availability/weekly');
  },

  // Créer une disponibilité hebdomadaire
  createWeeklyAvailability: async (availabilityData: AvailabilityCreate): Promise<Availability> => {
    return fetchApi<Availability>('/mentoring/availability/weekly', {
      method: 'POST',
      body: JSON.stringify(availabilityData)
    });
  },

  // Mettre à jour une disponibilité hebdomadaire
  updateWeeklyAvailability: async (id: string, availabilityData: AvailabilityUpdate): Promise<Availability> => {
    return fetchApi<Availability>(`/mentoring/availability/weekly/${id}`, {
      method: 'PUT',
      body: JSON.stringify(availabilityData)
    });
  },

  // Supprimer une disponibilité hebdomadaire
  deleteWeeklyAvailability: async (id: string): Promise<void> => {
    await fetchApi<void>(`/mentoring/availability/weekly/${id}`, {
      method: 'DELETE'
    });
  },

  // Récupérer les disponibilités pour une date spécifique
  getSpecificDateAvailability: async (date: string): Promise<SpecificDateAvailability> => {
    return fetchApi<SpecificDateAvailability>(`/mentoring/availability/date/${date}`);
  },

  // Définir la disponibilité pour une date spécifique
  setSpecificDateAvailability: async (date: string, isAvailable: boolean, slots?: { start_time: string, end_time: string }[]): Promise<SpecificDateAvailability> => {
    return fetchApi<SpecificDateAvailability>('/mentoring/availability/date', {
      method: 'POST',
      body: JSON.stringify({
        date,
        is_available: isAvailable,
        available_slots: slots
      })
    });
  }
};

// Mentorés
export const menteesApi = {
  // Récupérer tous les mentorés
  getAllMentees: async (): Promise<Mentee[]> => {
    return fetchApi<Mentee[]>('/mentoring/mentees');
  },

  // Récupérer un mentoré par son ID
  getMenteeById: async (id: string): Promise<Mentee> => {
    return fetchApi<Mentee>(`/mentoring/mentees/${id}`);
  },

  // Récupérer un mentoré par l'ID de l'utilisateur
  getMenteeByUserId: async (userId: string): Promise<Mentee> => {
    return fetchApi<Mentee>(`/mentoring/mentees/user/${userId}`);
  }
};

// Tarifs
export const pricingApi = {
  // Récupérer tous les tarifs
  getAllPricing: async (): Promise<MentoringPricing[]> => {
    return fetchApi<MentoringPricing[]>('/mentoring/pricing');
  },

  // Récupérer un tarif par son ID
  getPricingById: async (id: string): Promise<MentoringPricing> => {
    return fetchApi<MentoringPricing>(`/mentoring/pricing/${id}`);
  },

  // Créer un nouveau tarif
  createPricing: async (pricingData: MentoringPricingCreate): Promise<MentoringPricing> => {
    return fetchApi<MentoringPricing>('/mentoring/pricing', {
      method: 'POST',
      body: JSON.stringify(pricingData)
    });
  },

  // Mettre à jour un tarif
  updatePricing: async (id: string, pricingData: MentoringPricingUpdate): Promise<MentoringPricing> => {
    return fetchApi<MentoringPricing>(`/mentoring/pricing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pricingData)
    });
  },

  // Supprimer un tarif
  deletePricing: async (id: string): Promise<void> => {
    await fetchApi<void>(`/mentoring/pricing/${id}`, {
      method: 'DELETE'
    });
  }
};

// Visioconférence
export const videoCallApi = {
  // Créer une nouvelle salle de visioconférence
  createRoom: async (sessionId: string): Promise<{ roomId: string, roomUrl: string }> => {
    return fetchApi<{ roomId: string, roomUrl: string }>('/mentoring/videocall/create-room', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId })
    });
  },

  // Rejoindre une salle de visioconférence
  joinRoom: async (roomId: string): Promise<{ token: string }> => {
    return fetchApi<{ token: string }>('/mentoring/videocall/join-room', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId })
    });
  },

  // Terminer une salle de visioconférence
  endRoom: async (roomId: string): Promise<void> => {
    await fetchApi<void>('/mentoring/videocall/end-room', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId })
    });
  }
};

export const mentoringApi = {
  sessions: mentoringSessionsApi,
  availability: availabilityApi,
  mentees: menteesApi,
  pricing: pricingApi,
  videoCall: videoCallApi
};

export default mentoringApi;
