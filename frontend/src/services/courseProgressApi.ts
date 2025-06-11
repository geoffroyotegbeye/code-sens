import { api } from './api';

export interface CourseProgress {
  _id: string;
  user_id: string;
  course_id: string;
  started_at: string;
  last_accessed_at: string;
  completed_lessons: string[];
  last_lesson_id?: string;
  progress_percentage: number;
  is_completed: boolean;
}

export const courseProgressService = {
  // Récupérer la progression de tous les cours de l'utilisateur
  getUserCourseProgress: async (): Promise<CourseProgress[]> => {
    const response = await api.get('/course-progress/user/current');
    return response.data;
  },

  // Récupérer la progression d'un cours spécifique
  getCourseProgressForUser: async (courseId: string): Promise<CourseProgress> => {
    const response = await api.get(`/course-progress/course/${courseId}/user/current`);
    return response.data;
  },

  // Créer ou initialiser une progression de cours
  startCourse: async (courseId: string): Promise<CourseProgress> => {
    const response = await api.post('/course-progress', {
      course_id: courseId,
    });
    return response.data;
  },

  // Mettre à jour la progression d'un cours
  updateCourseProgress: async (progressId: string, data: Partial<CourseProgress>): Promise<CourseProgress> => {
    const response = await api.put(`/course-progress/${progressId}`, data);
    return response.data;
  },

  // Marquer une leçon comme complétée
  completeLesson: async (lessonId: string, courseId: string): Promise<CourseProgress> => {
    const response = await api.post(`/course-progress/lesson/${lessonId}/complete`, {}, {
      params: { course_id: courseId }
    });
    return response.data;
  }
};
