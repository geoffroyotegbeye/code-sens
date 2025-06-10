import { api } from './api';
import { Course, Module, Lesson } from '../types/course';

interface CourseCreateData {
  title: string;
  description: string;
  category_id: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  prerequisites: string[];
  objectives: string[];
}

interface CourseUpdateData extends Partial<CourseCreateData> {}

export const courseService = {
  // Formations
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getCourseBySlug: async (slug: string): Promise<Course> => {
    const response = await api.get(`/courses/slug/${slug}`);
    return response.data;
  },

  createCourse: async (data: CourseCreateData): Promise<Course> => {
    const response = await api.post('/courses', {
      ...data,
      category_id: data.category_id || null,
    });
    return response.data;
  },

  updateCourse: async (id: string, data: CourseUpdateData): Promise<Course> => {
    const response = await api.put(`/courses/${id}`, {
      ...data,
      category_id: data.category_id || null,
    });
    return response.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  // Modules
  addModule: async (courseId: string, data: { title: string; description?: string; order: number }): Promise<Course> => {
    const response = await api.post(`/courses/${courseId}/modules`, data);
    return response.data;
  },

  updateModule: async (courseId: string, moduleIndex: number, data: { title?: string; description?: string; order?: number }): Promise<Course> => {
    const response = await api.put(`/courses/${courseId}/modules/${moduleIndex}`, data);
    return response.data;
  },

  deleteModule: async (courseId: string, moduleIndex: number): Promise<Course> => {
    const response = await api.delete(`/courses/${courseId}/modules/${moduleIndex}`);
    return response.data;
  },

  // Leçons
  addLesson: async (courseId: string, moduleIndex: number, lessonData: {
    title: string;
    description: string;
    content: string;
    duration: number;
    type: 'video' | 'text' | 'quiz';
    order: number;
    video_url?: string;
    attachments?: File[];
  }): Promise<Lesson> => {
    try {
      const response = await api.post(`/courses/${courseId}/modules/${moduleIndex}/lessons`, lessonData);
      return response.data;
    } catch (error) {
      console.error('Error adding lesson:', error);
      throw error;
    }
  },

  updateLesson: async (courseId: string, moduleIndex: number, lessonIndex: number, data: { 
    title?: string; 
    description?: string; 
    content?: string; 
    duration?: number; 
    type?: 'video' | 'text' | 'quiz'; 
    order?: number;
    video_url?: string;
  }): Promise<Course> => {
    try {
      const response = await api.put(`/courses/${courseId}/modules/${moduleIndex}/lessons/${lessonIndex}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  },

  deleteLesson: async (courseId: string, moduleIndex: number, lessonIndex: number): Promise<Course> => {
    const response = await api.delete(`/courses/${courseId}/modules/${moduleIndex}/lessons/${lessonIndex}`);
    return response.data;
  },
}; 