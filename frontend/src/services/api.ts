const API_URL = 'http://localhost:8000/api/v1';

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
async function fetchApi<T>(
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Une erreur est survenue');
  }
  
  return response.json();
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
