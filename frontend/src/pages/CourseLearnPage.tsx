import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { courseService } from '../services/courseApi';
import { Course, Lesson } from '../types/course';
import { toast } from 'react-hot-toast';

// Import des sous-composants
import ModulesList from '../components/courses/learn/ModulesList';
import LessonContent from '../components/courses/learn/LessonContent';

const CourseLearnPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseById(courseId!);
      setCourse(data);
      
      // Ouvrir automatiquement le premier module
      if (data.modules && data.modules.length > 0) {
        setExpandedModules(prev => ({ ...prev, 'module-0': true }));
        
        // Sélectionner automatiquement la première leçon
        if (data.modules[0].lessons && data.modules[0].lessons.length > 0) {
          setSelectedLesson(data.modules[0].lessons[0]);
          setSelectedLessonId(data.modules[0].lessons[0]._id);
        }
      }
      
      // Charger les progrès de l'utilisateur (à implémenter plus tard)
      // loadUserProgress(courseId);
      
    } catch (error) {
      toast.error('Erreur lors du chargement de la formation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      if (prev[moduleId]) {
        return { ...prev, [moduleId]: false };
      } else {
        return { ...prev, [moduleId]: true };
      }
    });
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedLessonId(lesson._id);
    
    // Marquer la leçon comme vue (à implémenter plus tard)
    // markLessonAsViewed(lesson._id);
  };

  // Fonction pour marquer une leçon comme terminée (à implémenter plus tard)
  const markLessonAsCompleted = (lessonId: string) => {
    setProgress(prev => ({ ...prev, [lessonId]: true }));
    // Sauvegarder les progrès sur le serveur (à implémenter plus tard)
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-4">Chargement...</div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-4">Formation non trouvée</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/courses" className="text-gray-700 hover:text-blue-600">
                  Formations
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <Link to={`/courses/${course._id}`} className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                    {course.title}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">Apprendre</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Titre de la formation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des modules et leçons */}
          <div className="lg:col-span-1">
            <ModulesList
              course={course}
              expandedModules={expandedModules}
              onToggleModule={toggleModule}
              onSelectLesson={handleSelectLesson}
              selectedLessonId={selectedLessonId}
            />
          </div>

          {/* Contenu de la leçon sélectionnée */}
          <div className="lg:col-span-2">
            <LessonContent selectedLesson={selectedLesson} />
            
            {/* Boutons de navigation et de progression */}
            {selectedLesson && (
              <div className="mt-6 flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={() => {
                    // Navigation vers la leçon précédente (à implémenter)
                    toast.success("Navigation vers la leçon précédente (à implémenter)");
                  }}
                >
                  Leçon précédente
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => {
                    // Marquer comme terminé et passer à la leçon suivante
                    if (selectedLesson._id) {
                      markLessonAsCompleted(selectedLesson._id);
                      toast.success("Leçon marquée comme terminée !");
                      // Navigation vers la leçon suivante (à implémenter)
                    }
                  }}
                >
                  Marquer comme terminé et continuer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseLearnPage;
