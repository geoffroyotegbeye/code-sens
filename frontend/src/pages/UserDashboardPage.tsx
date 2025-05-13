import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Play, Calendar } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { courses } from '../data/mockData';

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'mentoring'>('courses');
  
  // Simulate enrolled courses (in a real app this would come from the user's data)
  const enrolledCourses = courses.slice(0, 3);
  
  // Calculate progress for each course (random for demo)
  const getRandomProgress = () => Math.floor(Math.random() * 100);
  
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
              <Link to="/mentoring">
                <Button className="text-white">
                  <Calendar size={16} className="mr-2" />
                  Demander un mentorat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`pb-4 px-4 font-medium ${
              activeTab === 'courses'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('courses')}
          >
            Mes formations
          </button>
          <button
            className={`pb-4 px-4 font-medium ${
              activeTab === 'mentoring'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('mentoring')}
          >
            Mes rendez-vous de mentorat
          </button>
        </div>
        
        {activeTab === 'courses' && (
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
                              {Math.round(progress / 100 * course.modules.reduce((acc, m) => acc + m.chapters.length, 0))} / {course.modules.reduce((acc, m) => acc + m.chapters.length, 0)} leçons
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
        )}
        
        {activeTab === 'mentoring' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Prochaines sessions</h2>
            
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Sessions à venir</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session planifiée</h3>
                  <p className="text-gray-600 mb-6">
                    Vous n'avez pas encore de session de mentorat à venir.
                  </p>
                  <Link to="/mentoring">
                    <Button className='text-white'>Demander un mentorat</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6">Historique des sessions</h2>
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session passée</h3>
                  <p className="text-gray-600">
                    Votre historique de sessions de mentorat apparaîtra ici.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserDashboardPage;