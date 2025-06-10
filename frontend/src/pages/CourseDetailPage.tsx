import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, ChevronDown, ChevronUp, Play } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseApi';
import { Course } from '../types/course';
import { toast } from 'react-hot-toast';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated } = useAuth();
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarCourses, setSimilarCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);
  
  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourseById(courseId as string);
      setCourse(courseData);
      
      // Charger les cours similaires
      if (courseData?.category_id) {
        const allCourses = await courseService.getAllCourses();
        const filtered = allCourses.filter(c => 
          c.category_id === courseData.category_id && 
          c._id !== courseData._id
        ).slice(0, 3);
        setSimilarCourses(filtered);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du cours:', error);
      toast.error('Impossible de charger les détails du cours');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du cours...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Formation non trouvée</h2>
          <p className="text-gray-600 mb-8">
            La formation que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Link to="/courses">
            <Button>Retour aux formations</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      // Créer une copie de l'état précédent
      const newState = { ...prev };
      
      // Inverser l'état du module sélectionné
      newState[moduleId] = !prev[moduleId];
      
      return newState;
    });
  };
  
  // Calculate total number of lessons
  const totalLessons = course.modules && Array.isArray(course.modules) 
    ? course.modules.reduce((acc, module) => acc + (module.lessons && Array.isArray(module.lessons) ? module.lessons.length : 0), 0)
    : 0;
  
  return (
    <MainLayout>
      {/* Course Header */}
      <section className="relative bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:max-w-2xl">
              <div className="mb-4">
                <Link to="/courses" className="text-blue-200 hover:text-white text-sm flex items-center">
                  <ChevronUp className="rotate-90 mr-1" size={16} />
                  Retour aux formations
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-blue-300" />
                  <span>{course.duration || 'Non spécifié'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-300" />
                  <span>Mis à jour le {new Date(course.created_at || course.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <User size={18} className="mr-2 text-blue-300" />
                  <span>Par {course.instructor || 'Formateur'}</span>
                </div>
              </div>
              <p className="text-blue-100">{course.description}</p>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={course.coverImage || 'https://placehold.co/600x400?text=Formation'} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400?text=Formation';
                  }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Cette formation inclut:</p>
                      <p className="font-semibold">{course.modules?.length || 0} modules • {totalLessons} leçons</p>
                    </div>
                  </div>
                  {isAuthenticated ? (
                    <Link to={`/courses/${course._id}/learn`}>
                      <Button fullWidth className='text-white'>
                        Commencer la formation
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/login">
                        <Button fullWidth className='text-white'>
                          Se connecter pour commencer
                        </Button>
                      </Link>
                      <p className="text-center text-sm text-gray-500">
                        Pas encore inscrit? <Link to="/register" className="text-blue-600 hover:underline">Créer un compte</Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-6">Contenu de la formation</h2>
              
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={module._id || `module-${index}`} className="border rounded-lg overflow-hidden">
                      <div 
                        className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleModule(`module-${index}`)}
                      >
                        <h3 className="font-medium text-lg">{module.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">{module.lessons?.length || 0} leçons</span>
                          {expandedModules[`module-${index}`] ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </div>
                      
                      {expandedModules[`module-${index}`] && (
                        <div>
                          {module.lessons && module.lessons.map((lesson, index) => (
                            <div 
                              key={lesson._id} 
                              className={`p-4 flex justify-between items-center ${
                                index < module.lessons.length - 1 && 'border-b'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-gray-600">
                                    <Play size={14} />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{lesson.title}</h4>
                                    <p className="text-sm text-gray-500">{lesson.duration} min</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun contenu disponible pour le moment.</p>
              )}
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                <h3 className="text-xl font-bold mb-4">À propos du formateur</h3>
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Geoffroy – Créateur de Webrichesse" 
                    className="w-16 h-16 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold">Geoffroy</h4>
                    <p className="text-sm text-gray-600">Créateur de Webrichesse</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Développeur autodidacte basé au Bénin, Geoffroy utilise le code pour construire des ponts entre la jeunesse africaine et les opportunités du web. Il ne forme pas seulement des développeurs, il aide à changer des vies. Sa mission : faire de Webrichesse une plateforme qui révèle des talents et ouvre les portes de la tech, pour les jeunes, les femmes et les adultes en reconversion.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formations</span>
                    <span className="font-medium">3 (et en pleine croissance)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Étudiants</span>
                    <span className="font-medium">200+ en cours de formation, avec l'objectif de former 10 000 jeunes d'ici 2026.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Note moyenne</span>
                    <span className="font-medium">5.0 / 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Courses */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Formations similaires</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCourses.map(relatedCourse => (
                <Link 
                  key={relatedCourse._id} 
                  to={`/courses/${relatedCourse._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={relatedCourse.coverImage || 'https://placehold.co/600x400?text=Formation'} 
                      alt={relatedCourse.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x400?text=Formation';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedCourse.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{relatedCourse.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>{relatedCourse.instructor || 'Formateur'}</span>
                      <span>{relatedCourse.duration || 'Non spécifié'}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CourseDetailPage;