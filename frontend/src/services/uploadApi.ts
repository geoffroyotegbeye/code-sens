const API_URL = 'http://localhost:8000/api/v1';
const BASE_URL = '/upload';
const SERVER_URL = 'http://localhost:8000';

export const uploadApi = {
  /**
   * Télécharge une image et retourne son URL
   * @param file - Le fichier image à télécharger
   * @param onProgress - Fonction de callback pour suivre la progression du téléchargement
   * @returns L'URL de l'image téléchargée
   */
  /**
   * Télécharge une image et retourne son URL
   * @param file - Le fichier image à télécharger
   * @param onProgress - Fonction de callback pour suivre la progression du téléchargement
   * @returns L'URL de l'image téléchargée sur le serveur
   */
  async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
    try {
      return new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('token');
        
        // Utiliser XMLHttpRequest pour pouvoir suivre la progression
        const xhr = new XMLHttpRequest();
        
        // Configurer les événements de progression
        if (onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              onProgress(progress);
            }
          };
        }
        
        // Configurer la gestion de la réponse
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data && data.url) {
                // Récupérer l'URL réelle du serveur
                const serverUrl = data.url.startsWith('/') 
                  ? `${SERVER_URL}${data.url}` 
                  : data.url;
                
                console.log('Image téléchargée avec succès');
                console.log('Chemin relatif:', data.url);
                console.log('Chemin complet:', serverUrl);
                
                // Résoudre la promesse avec l'URL réelle du serveur
                resolve(serverUrl);
              } else {
                reject(new Error('Le serveur n\'a pas renvoyé d\'URL d\'image valide'));
              }
            } catch (e) {
              reject(new Error('Erreur lors du parsing de la réponse'));
            }
          } else {
            reject(new Error(`Erreur ${xhr.status}: ${xhr.statusText}`));
          }
        };
        
        // Configurer la gestion des erreurs
        xhr.onerror = () => {
          reject(new Error('Erreur réseau lors du téléchargement'));
        };
        
        // Configurer la requête
        xhr.open('POST', `${API_URL}${BASE_URL}/image`, true);
        
        // Ajouter les en-têtes d'autorisation
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        // Envoyer la requête
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Erreur dans uploadImage:', error);
      throw error;
    }
  },
  
  /**
   * Obtient l'URL complète d'une image à partir de son chemin relatif
   * @param path - Chemin relatif de l'image
   * @returns L'URL complète de l'image
   */
  getImageUrl(path: string): string {
    if (!path) return '';
    
    // Si le chemin est déjà une URL complète, la retourner telle quelle
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    
    // Sinon, ajouter l'URL du serveur
    return `${SERVER_URL}${path}`;
  }
};
