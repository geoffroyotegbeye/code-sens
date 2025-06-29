import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserResponse, AUTH_EVENTS } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, fullName: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Essayer de récupérer l'utilisateur, mais ne pas déconnecter immédiatement en cas d'échec
      fetchCurrentUser(true);
    } else {
      setLoading(false);
    }
  }, []);
  
  // Écouter l'événement de déconnexion forcée
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      // Au lieu d'utiliser useNavigate, nous allons rediriger avec window.location
      window.location.href = '/login';
      toast.error('Votre session a expiré. Veuillez vous reconnecter.');
    };
    
    window.addEventListener(AUTH_EVENTS.FORCE_LOGOUT, handleForceLogout);
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.FORCE_LOGOUT, handleForceLogout);
    };
  }, []);

  const fetchCurrentUser = async (tolerateErrors: boolean = false) => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      
      // Si nous sommes en mode tolérant aux erreurs (comme lors d'un rafraîchissement de page),
      // ne pas déconnecter l'utilisateur immédiatement
      if (!tolerateErrors) {
        // Clear token if it's invalid
        authService.logout();
      } else {
        // En cas d'erreur lors du chargement initial, essayer de conserver la session
        // si possible en vérifiant le token localement
        const token = localStorage.getItem('token');
        if (!token) {
          authService.logout();
        } else {
          // Si le token existe mais est expiré, le supprimer
          authService.logout();
          // Rediriger vers la page de connexion
          window.location.href = '/login';
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Essayer de se connecter avec les identifiants fournis
      const response = await authService.login({ username: email, password });
      
      // Si la connexion réussit, stocker le token et récupérer les informations de l'utilisateur
      if (response && response.access_token) {
        localStorage.setItem('token', response.access_token);
        
        try {
          // Récupérer les informations de l'utilisateur
          const userData = await authService.getCurrentUser();
          setUser(userData);
          toast.success('Connexion réussie');
          return true;
        } catch (userError) {
          console.error('Erreur lors de la récupération des informations utilisateur:', userError);
          localStorage.removeItem('token');
          toast.error('Erreur lors de la récupération des informations utilisateur');
          return false;
        }
      } else {
        toast.error('Réponse de connexion invalide');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      const errorMessage = error instanceof Error ? error.message : 'Échec de la connexion';
      toast.error(errorMessage);
      return false;
    } finally {
      // Assurons-nous que loading est toujours remis à false
      setLoading(false);
    }
  };

  const register = async (email: string, fullName: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await authService.register({ email, full_name: fullName, password });
      toast.success('Inscription réussie. Vous pouvez maintenant vous connecter.');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      const errorMessage = error instanceof Error ? error.message : 'Échec de l\'inscription';
      toast.error(errorMessage);
      return false;
    } finally {
      // Assurons-nous que loading est toujours remis à false
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Déconnexion réussie');
  };

  const isAdmin = user?.is_admin ?? false;
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};