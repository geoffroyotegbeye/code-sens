export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  author_id: string;
  category: string;
  tags: string[];
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
