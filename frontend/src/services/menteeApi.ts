import { Mentee } from '../types/mentorat';

const API_URL = 'http://localhost:8000/api/v1';

// Fonction pour récupérer les données de l'API
const fetchData = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API error: ' + response.status);
  }

  return await response.json();
};

export const getMentees = async (): Promise<Mentee[]> => {
  return await fetchData('/mentoring/mentees');
};

export const acceptMenteeRequest = async (menteeId: string): Promise<Mentee> => {
  return await fetchData(`/mentoring/mentees/${menteeId}/accept`, { method: 'POST' });
};

export const rejectMenteeRequest = async (menteeId: string): Promise<Mentee> => {
  return await fetchData(`/mentoring/mentees/${menteeId}/reject`, { method: 'POST' });
};
