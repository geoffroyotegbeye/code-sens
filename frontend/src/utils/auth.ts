/**
 * Utilitaires pour l'authentification
 */

/**
 * Récupère l'en-tête d'autorisation pour les requêtes API
 * @returns Un objet contenant l'en-tête d'autorisation si un token est présent
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json'
  };
};

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns true si l'utilisateur est authentifié, false sinon
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Vérifie si l'utilisateur est un administrateur
 * @returns true si l'utilisateur est un administrateur, false sinon
 */
export const isAdmin = (): boolean => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  
  try {
    const user = JSON.parse(userStr);
    return !!user.is_admin;
  } catch (error) {
    return false;
  }
};

/**
 * Déconnecte l'utilisateur
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export default {
  getAuthHeader,
  isAuthenticated,
  isAdmin,
  logout
};
