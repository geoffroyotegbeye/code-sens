export interface Lesson {
  _id: string;
  id?: string; // Pour la rétrocompatibilité
  title: string;
  description?: string;
  content: string;
  duration: number;
  type: 'video' | 'text' | 'quiz';
  videoUrl?: string; // URL de la vidéo (YouTube, Vimeo, etc.)
  video_url?: string; // Format backend pour l'URL de la vidéo
  attachments?: Array<{
    name: string;
    url: string;
    type?: string;
    size?: number;
  }>; // Fichiers joints à la leçon (PDF, etc.)
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  _id: string;
  id?: string; // Pour la rétrocompatibilité
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  _id: string;
  id?: string; // Pour la rétrocompatibilité
  title: string;
  description: string;
  category_id: string;
  category?: string; // Nom de la catégorie
  price: number;
  is_active: boolean;
  featured: boolean;
  level: CourseLevel;
  duration?: number | string; // Peut être un nombre ou une chaîne comme "2h30min"
  language: string;
  prerequisites?: string[];
  objectives?: string[];
  slug: string;
  modules: Module[];
  enrolled_students: number;
  enrollmentCount?: number; // Alias pour enrolled_students
  instructor?: string; // Nom de l'instructeur
  coverImage?: string; // URL de l'image de couverture
  rating: number;
  total_ratings: number;
  created_at: string;
  updated_at: string;
  createdAt?: string; // Alias pour created_at
} 