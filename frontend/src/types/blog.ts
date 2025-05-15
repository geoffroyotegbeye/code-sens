export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  author_id: string;
  category: string | Category; // Peut être un ID de catégorie ou un objet Category complet
  tags: string[] | Tag[]; // Peut être des IDs de tags ou des objets Tag complets
  published_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  category: string;
  tags: string[];
  author_id?: string;
}

export interface BlogPostUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
}
