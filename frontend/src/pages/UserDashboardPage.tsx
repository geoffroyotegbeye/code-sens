import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Play } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseApi';
import { Course } from '../types/course';

const UserDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Calculate progress for each course (random for demo)
  const getRandomProgress = () => Math.floor(Math.random() * 100);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/dashboard' } });
      return;
    }

    const fetchUserData = async () => {
      try {
        // Récupérer les formations auxquelles l'utilisateur est inscrit
        try {
          const userCourses = await courseService.getUserEnrolledCourses();
          setEnrolledCourses(userCourses);
        } catch (error) {
          console.error('Erreur lors du chargement des formations:', error);
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated, navigate]);


  
  if (!isAuthenticated) {
    return null; // Redirection gérée par useEffect
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Bienvenue, {user?.full_name || 'Utilisateur'}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/courses">
                <Button variant="outline">
                  <BookOpen size={16} className="mr-2" />
                  Explorer les formations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Mon tableau de bord</h1>
        </div>
        
        <div className="mb-6">
          <div className="flex border-b">
            <div className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">
              Mes formations
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-6">Formations en cours</h2>
          
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => {
                const progress = getRandomProgress();
                
                return (
                  <Card key={course.id}>
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={course.coverImage} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Link to={`/courses/${course.id}`}>
                          <Button size="sm" className="flex items-center text-white">
                            <Play size={16} className="mr-2" />
                            Continuer
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <CardContent>
                      <h3 className="font-semibold mb-2">
                        <Link to={`/courses/${course.id}`} className="hover:text-blue-600">
                          {course.title}
                        </Link>
                      </h3>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-600">
                          <Clock size={14} className="inline mr-1" /> {course.duration}
                        </span>
                        <span className="text-gray-600">
                          Par {course.instructor}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{progress}% complété</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(progress / 100 * course.modules.reduce((acc, m) => acc + m.lessons?.length || 0, 0))} / {course.modules.reduce((acc, m) => acc + m.lessons?.length || 0, 0)} leçons
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune formation en cours</h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore commencé de formation.
              </p>
              <Link to="/courses">
                <Button>Explorer les formations</Button>
              </Link>
            </div>
          )}
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Formations terminées</h2>
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune formation terminée</h3>
                <p className="text-gray-600">
                  Continuez à apprendre pour voir vos formations terminées ici.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default UserDashboardPage;