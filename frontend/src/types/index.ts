export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  coverImage: string;
  duration: string;
  modules: Module[];
  featured?: boolean;
  category: string;
  enrollmentCount: number;
  rating: number;
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  videoUrl?: string;
  duration: string;
  completed?: boolean;
}

export interface MentoringRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  topic: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  preferredDate?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: User;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  likes: number;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  replies?: BlogComment[];
}