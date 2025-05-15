import { BlogPost, BlogPostCreate, BlogPostUpdate, Category } from '../types/blog';

const API_URL = 'http://localhost:8000/api/v1';

// Helper function for making API requests
async function fetchApi<T>(
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
    
    console.log(`Envoi de la requête à ${API_URL}${endpoint}`);
    console.log('Options:', { ...options, headers: Object.fromEntries(headers.entries()) });
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      // Inclure les cookies dans la requête
      credentials: 'include',
    });
    
    console.log(`Réponse reçue: ${response.status} ${response.statusText}`);
    
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
    console.log('Données reçues:', data);
    return data;
  } catch (error) {
    console.error('Erreur dans fetchApi:', error);
    throw error;
  }
}

const BASE_URL = '/blog';

export const blogApi = {
  getAllPosts: async (skip = 0, limit = 10, category?: string): Promise<BlogPost[]> => {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    if (category) {
      params.append('category', category);
    }
    
    return fetchApi<BlogPost[]>(`${BASE_URL}?${params.toString()}`);
  },
  
  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    return fetchApi<BlogPost>(`${BASE_URL}/${slug}`);
  },
  
  createPost: async (post: BlogPostCreate): Promise<BlogPost> => {
    return fetchApi<BlogPost>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },
  
  updatePost: async (slug: string, post: BlogPostUpdate): Promise<BlogPost> => {
    return fetchApi<BlogPost>(`${BASE_URL}/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  },
  
  deletePost: async (slug: string): Promise<boolean> => {
    return fetchApi<boolean>(`${BASE_URL}/${slug}`, {
      method: 'DELETE',
    });
  },
  
  // Gestion des catégories
  getCategories: async (): Promise<Category[]> => {
    return fetchApi<Category[]>('/categories');
  },
  
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    return fetchApi<Category>(`/categories/slug/${slug}`);
  },
  
  getCategoryById: async (id: string): Promise<Category> => {
    return fetchApi<Category>(`/categories/${id}`);
  },
  
  createCategory: async (category: { name: string; description?: string }): Promise<Category> => {
    // Générer le slug à partir du nom
    const slug = category.name.toLowerCase().replace(/\s+/g, '-');
    
    return fetchApi<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({
        ...category,
        slug
      }),
    });
  },
  
  updateCategory: async (id: string, category: { name?: string; description?: string }): Promise<Category> => {
    // Si le nom est mis à jour, générer un nouveau slug
    const updateData: any = { ...category };
    if (category.name) {
      updateData.slug = category.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    return fetchApi<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  
  deleteCategory: async (id: string): Promise<boolean> => {
    return fetchApi<boolean>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
  

  
  // Gestion des commentaires
  getCommentsByPostId: async (postId: string): Promise<any[]> => {
    return fetchApi<any[]>(`${BASE_URL}/${postId}/comments`);
  },
  
  createComment: async (postId: string, comment: { content: string }): Promise<any> => {
    return fetchApi<any>(`${BASE_URL}/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  },
  
  deleteComment: async (commentId: string): Promise<boolean> => {
    return fetchApi<boolean>(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }
};
