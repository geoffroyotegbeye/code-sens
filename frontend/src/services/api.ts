const API_URL = 'http://localhost:8000/api/v1';

// Événement personnalisé pour la déconnexion forcée
export const AUTH_EVENTS = {
  FORCE_LOGOUT: 'auth:force_logout',
};

// Création d'un événement personnalisé pour la déconnexion forcée
export const forceLogoutEvent = new CustomEvent(AUTH_EVENTS.FORCE_LOGOUT);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  full_name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function for making API requests
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    // Gérer spécifiquement les erreurs d'authentification
    if (response.status === 401) {
      // Si l'erreur est due à un token expiré
      // Essayer de rafraîchir le token si ce n'est pas déjà une tentative de rafraîchissement
      if (endpoint !== '/auth/refresh' && token) {
        try {
          // Tenter de rafraîchir le token
          const refreshResult = await refreshToken();
          if (refreshResult) {
            // Si le token a été rafraîchi avec succès, réessayer la requête originale
            return fetchApi(endpoint, options);
          }
        } catch (refreshError) {
          // Si le rafraîchissement échoue, déconnecter l'utilisateur
          console.error('Impossible de rafraîchir le token:', refreshError);
          authService.logout();
          // Déclencher l'événement de déconnexion forcée
          window.dispatchEvent(forceLogoutEvent);
          throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
        }
      } else {
        // Si c'est déjà une tentative de rafraîchissement ou s'il n'y a pas de token
        authService.logout();
        window.dispatchEvent(forceLogoutEvent);
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
    }
    
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Une erreur est survenue');
  }
  
  return response.json();
}

// Fonction pour rafraîchir le token d'authentification
async function refreshToken(): Promise<boolean> {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    return false;
  }
}

// Authentication services
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Identifiants incorrects');
    }
    
    return response.json();
  },
  
  async register(data: RegisterData): Promise<UserResponse> {
    return fetchApi<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async getCurrentUser(): Promise<UserResponse> {
    return fetchApi<UserResponse>('/auth/me');
  },
  
  logout() {
    localStorage.removeItem('token');
  },
};

export default {
  auth: authService,
};
