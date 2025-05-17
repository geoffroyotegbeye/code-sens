// URL de base de l'API
const API_URL = 'http://localhost:8000/api/v1';

console.log('URL du backend configurée:', API_URL);

// Événements personnalisés pour l'authentification
export const AUTH_EVENTS = {
  FORCE_LOGOUT: 'auth:force_logout',
  SESSION_EXPIRED: 'auth:session_expired',
  LOGIN_SUCCESS: 'auth:login_success',
  LOGIN_FAILURE: 'auth:login_failure',
  REGISTER_SUCCESS: 'auth:register_success',
  REGISTER_FAILURE: 'auth:register_failure'
};

// Fonction pour créer et dispatcher un événement d'authentification
export function dispatchAuthEvent(eventType: string, detail: any = {}) {
  const event = new CustomEvent(eventType, { detail });
  window.dispatchEvent(event);
  console.log(`Événement dispatché: ${eventType}`, detail);
}

// Types pour l'authentification
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

// Helper function for making API requests - version simplifiée
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = localStorage.getItem('token');
    
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log(`Envoi de requête à ${API_URL}${endpoint}`);
    
    // Ajouter un timeout pour éviter les requêtes qui restent en attente indéfiniment
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error(`Timeout de la requête à ${endpoint}`);
    }, 10000); // 10 secondes de timeout
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      });
      
      // Annuler le timeout car la requête s'est terminée
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.log(`Réponse non-OK reçue de ${endpoint}:`, response.status, response.statusText);
        
        // Gérer spécifiquement les erreurs d'authentification
        if (response.status === 401) {
          // Session expirée, déconnecter l'utilisateur
          authService.logout();
          dispatchAuthEvent(AUTH_EVENTS.SESSION_EXPIRED);
          throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
        }
        
        // Tenter de récupérer les détails de l'erreur depuis la réponse JSON
        try {
          const error = await response.json();
          console.error('Détails de l\'erreur:', error);
          throw new Error(error.detail || `Erreur ${response.status}: ${response.statusText}`);
        } catch (jsonError) {
          // Si la réponse n'est pas au format JSON
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
      }
      
      try {
        const data = await response.json();
        return data;
      } catch (jsonError) {
        console.error('Erreur lors du parsing de la réponse JSON:', jsonError);
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      // Annuler le timeout en cas d'erreur
      clearTimeout(timeoutId);
      
      // Vérifier si l'erreur est due à un timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La connexion au serveur a pris trop de temps. Veuillez réessayer plus tard.');
      }
      
      throw error;
    }
  } catch (error) {
    console.error(`Erreur dans fetchApi pour ${endpoint}:`, error);
    throw error;
  }
}

// Fonction pour vérifier si le token est encore valide
export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  try {
    // Décoder le token JWT (sans vérification de signature)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    
    // Vérifier si le token a expiré
    const expired = Date.now() >= exp * 1000;
    return expired;
  } catch (e) {
    console.error('Erreur lors de la vérification de l\'expiration du token:', e);
    return true; // En cas d'erreur, considérer le token comme expiré
  }
}

// Authentication services - Version simplifiée et robuste
export const authService = {
  /**
   * Connexion utilisateur
   * @param credentials Identifiants de connexion
   * @returns Promesse avec la réponse d'authentification
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Tentative de connexion pour:', credentials.username);
      
      // Préparation des données de formulaire
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      // Création d'un signal d'abandon avec timeout
      const signal = AbortSignal.timeout(10000); // 10 secondes maximum
      
      // Envoi de la requête de connexion
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        signal
      });
      
      // Vérification de la réponse
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorMessage;
        } catch (e) {
          // Si le texte n'est pas du JSON valide, on utilise le message d'erreur par défaut
        }
        
        // Dispatcher un événement d'échec de connexion
        dispatchAuthEvent(AUTH_EVENTS.LOGIN_FAILURE, { error: errorMessage });
        throw new Error(errorMessage);
      }
      
      // Parsing de la réponse
      const data = await response.json();
      
      // Stockage du token
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        dispatchAuthEvent(AUTH_EVENTS.LOGIN_SUCCESS);
        return data;
      } else {
        throw new Error('Réponse de connexion invalide');
      }
    } catch (error) {
      // Gérer les erreurs de timeout
      if (error instanceof DOMException && error.name === 'AbortError') {
        const timeoutError = new Error('La connexion au serveur a pris trop de temps. Veuillez réessayer plus tard.');
        dispatchAuthEvent(AUTH_EVENTS.LOGIN_FAILURE, { error: timeoutError.message });
        throw timeoutError;
      }
      
      // Autres erreurs
      console.error('Erreur lors de la connexion:', error);
      dispatchAuthEvent(AUTH_EVENTS.LOGIN_FAILURE, { 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la connexion'
      });
      throw error;
    }
  },
  
  /**
   * Inscription utilisateur
   * @param data Données d'inscription
   * @returns Promesse avec les données utilisateur
   */
  async register(data: RegisterData): Promise<UserResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000) // 10 secondes maximum
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorMessage;
        } catch (e) {
          // Si le texte n'est pas du JSON valide, on utilise le message d'erreur par défaut
        }
        
        dispatchAuthEvent(AUTH_EVENTS.REGISTER_FAILURE, { error: errorMessage });
        throw new Error(errorMessage);
      }
      
      const userData = await response.json();
      dispatchAuthEvent(AUTH_EVENTS.REGISTER_SUCCESS);
      return userData;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      dispatchAuthEvent(AUTH_EVENTS.REGISTER_FAILURE, { 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'inscription'
      });
      throw error;
    }
  },
  
  /**
   * Récupérer les informations de l'utilisateur connecté
   * @returns Promesse avec les données utilisateur
   */
  async getCurrentUser(): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Aucun token d\'authentification');
      }
      
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000) // 5 secondes maximum
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Session expirée
          this.logout();
          dispatchAuthEvent(AUTH_EVENTS.SESSION_EXPIRED);
          throw new Error('Session expirée');
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      throw error;
    }
  },
  
  /**
   * Déconnexion utilisateur
   */
  logout() {
    localStorage.removeItem('token');
    dispatchAuthEvent(AUTH_EVENTS.FORCE_LOGOUT);
  },
};

export default {
  auth: authService,
};
