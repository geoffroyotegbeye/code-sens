import { fetchApi } from './api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const categoryService = {
  // Récupérer toutes les catégories
  getAllCategories(): Promise<Category[]> {
    return fetchApi<Category[]>('/categories');
  },

  // Récupérer une catégorie par son ID
  getCategoryById(id: string): Promise<Category> {
    return fetchApi<Category>(`/categories/${id}`);
  },

  // Récupérer une catégorie par son slug
  getCategoryBySlug(slug: string): Promise<Category> {
    return fetchApi<Category>(`/categories/slug/${slug}`);
  },

  // Créer une nouvelle catégorie (réservé aux administrateurs)
  createCategory(data: { name: string; slug: string; description?: string }): Promise<Category> {
    return fetchApi<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Mettre à jour une catégorie (réservé aux administrateurs)
  updateCategory(id: string, data: { name?: string; slug?: string; description?: string }): Promise<Category> {
    return fetchApi<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Supprimer une catégorie (réservé aux administrateurs)
  deleteCategory(id: string): Promise<void> {
    return fetchApi<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

export default categoryService;
