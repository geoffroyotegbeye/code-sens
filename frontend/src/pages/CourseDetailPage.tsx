import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, ChevronDown, ChevronUp, Play } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { courses } from '../data/mockData';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated } = useAuth();
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  
  const course = courses.find(c => c.id === courseId);
  
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
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  // Calculate total number of chapters
  const totalChapters = course.modules.reduce((acc, module) => acc + module.chapters.length, 0);
  
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
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-300" />
                  <span>Mis à jour le {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <User size={18} className="mr-2 text-blue-300" />
                  <span>Par {course.instructor}</span>
                </div>
              </div>
              <p className="text-blue-100">{course.description}</p>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={course.coverImage} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Cette formation inclut:</p>
                      <p className="font-semibold">{course.modules.length} modules • {totalChapters} chapitres</p>
                    </div>
                  </div>
                  {isAuthenticated ? (
                    <Button fullWidth className='text-white'>
                      Commencer la formation
                    </Button>
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
              
              {course.modules.length > 0 ? (
                <div className="space-y-4">
                  {course.modules.map((module) => (
                    <div key={module.id} className="border rounded-lg overflow-hidden">
                      <div 
                        className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleModule(module.id)}
                      >
                        <h3 className="font-medium text-lg">{module.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">{module.chapters.length} chapitres</span>
                          {expandedModules[module.id] ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </div>
                      
                      {expandedModules[module.id] && (
                        <div>
                          {module.chapters.map((chapter, index) => (
                            <div 
                              key={chapter.id} 
                              className={`p-4 flex justify-between items-center ${
                                index < module.chapters.length - 1 && 'border-b'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-gray-600">
                                  <Play size={14} />
                                </div>
                                <div>
                                  <h4 className="font-medium">{chapter.title}</h4>
                                  <p className="text-sm text-gray-500">{chapter.duration}</p>
                                </div>
                              </div>
                              {isAuthenticated ? (
                                <Button size="sm" variant="ghost">
                                  Regarder
                                </Button>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  Connectez-vous
                                </span>
                              )}
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
                    alt={course.instructor} 
                    className="w-16 h-16 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold">{course.instructor}</h4>
                    <p className="text-sm text-gray-600">Expert {course.category}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Formateur expérimenté avec plus de 10 ans d'expérience dans le domaine. Passionné par le partage de connaissances et l'accompagnement des apprenants dans leur parcours professionnel.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formations</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Étudiants</span>
                    <span className="font-medium">2,500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Note moyenne</span>
                    <span className="font-medium">4.8/5</span>
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
            {courses
              .filter(c => c.category === course.category && c.id !== course.id)
              .slice(0, 3)
              .map(relatedCourse => (
                <Link 
                  key={relatedCourse.id} 
                  to={`/courses/${relatedCourse.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={relatedCourse.coverImage} 
                      alt={relatedCourse.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedCourse.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{relatedCourse.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>{relatedCourse.instructor}</span>
                      <span>{relatedCourse.duration}</span>
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