const API_URL = 'http://localhost:8000/api/v1';
const BASE_URL = '/upload';

export const uploadApi = {
  /**
   * Télécharge une image et retourne son URL
   * @param file - Le fichier image à télécharger
   * @returns L'URL de l'image téléchargée
   */
  async uploadImage(file: File): Promise<string> {
    try {
      console.log('Préparation du téléchargement de l\'image:', file.name, file.type, file.size);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Envoi de la requête au serveur:', `${API_URL}${BASE_URL}/image`);
      
      const response = await fetch(`${API_URL}${BASE_URL}/image`, {
        method: 'POST',
        body: formData,
        headers,
        // Inclure les cookies dans la requête
        credentials: 'include',
      });
      
      console.log('Réponse du serveur:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('Détails de l\'erreur:', errorData);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          console.error('Impossible de parser la réponse d\'erreur');
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Données reçues du serveur:', data);
      
      if (!data || !data.url) {
        throw new Error('Le serveur n\'a pas renvoyé d\'URL d\'image valide');
      }
      
      return data.url;
    } catch (error) {
      console.error('Erreur dans uploadImage:', error);
      throw error;
    }
  }
};
