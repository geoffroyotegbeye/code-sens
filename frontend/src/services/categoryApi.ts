import { fetchApi } from './api';
import { Category } from '../types/category';

export const categoryService = {
  // Récupérer toutes les catégories
  async getAllCategories(): Promise<Category[]> {
    console.log('Tentative de récupération des catégories...');
    try {
      const categories = await fetchApi<Category[]>('/course-categories');
      console.log('Catégories récupérées avec succès:', categories);
      return categories;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  // Récupérer une catégorie par son ID
  getCategoryById(id: string): Promise<Category> {
    return fetchApi<Category>(`/course-categories/${id}`);
  },

  // Récupérer une catégorie par son slug
  getCategoryBySlug(slug: string): Promise<Category> {
    return fetchApi<Category>(`/course-categories/slug/${slug}`);
  },

  // Créer une nouvelle catégorie (réservé aux administrateurs)
  createCategory(data: { name: string; slug: string; description?: string }): Promise<Category> {
    return fetchApi<Category>('/course-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Mettre à jour une catégorie (réservé aux administrateurs)
  updateCategory(id: string, data: { name?: string; slug?: string; description?: string }): Promise<Category> {
    return fetchApi<Category>(`/course-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Supprimer une catégorie (réservé aux administrateurs)
  deleteCategory(id: string): Promise<void> {
    return fetchApi<void>(`/course-categories/${id}`, {
      method: 'DELETE',
    });
  },
};

export default categoryService;
