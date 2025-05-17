import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Play, Calendar } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { courses } from '../data/mockData';
import MentoringRequestModal from '../components/mentoring/MentoringRequestModal';
import MentoringSessionDetails from '../components/mentoring/MentoringSessionDetails';
import mentoringApi from '../services/mentoringApi';
import { MentoringSession } from '../types/mentoring';

const UserDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'mentoring'>('courses');
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menteeId, setMenteeId] = useState<string | null>(null);
  
  // Simulate enrolled courses (in a real app this would come from the user's data)
  const enrolledCourses = courses.slice(0, 3);
  
  // Calculate progress for each course (random for demo)
  const getRandomProgress = () => Math.floor(Math.random() * 100);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/dashboard' } });
      return;
    }

    const fetchUserData = async () => {
      try {
        // Vérifier si l'utilisateur est déjà un mentoré
        try {
          const mentee = await mentoringApi.mentees.getMenteeByUserId(user?.id || '');
          setMenteeId(mentee.id);
          
          // Récupérer les sessions de mentorat du mentoré
          const mentoringSessions = await mentoringApi.sessions.getSessionsByMenteeId(mentee.id);
          setSessions(mentoringSessions);
        } catch (error) {
          // L'utilisateur n'est pas encore un mentoré
          console.log('L\'utilisateur n\'est pas encore un mentoré');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated, navigate]);

  // Ces fonctions sont utilisées dans le composant MentoringSessionDetails

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    // Recharger les données après une demande réussie
    if (menteeId) {
      mentoringApi.sessions.getSessionsByMenteeId(menteeId)
        .then(mentoringSessions => {
          setSessions(mentoringSessions);
        })
        .catch(error => {
          console.error('Erreur lors du chargement des sessions:', error);
        });
    }
  };
  
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
              <Button onClick={() => setIsModalOpen(true)} className="text-white">
                <Calendar size={16} className="mr-2" />
                Demander un mentorat
              </Button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Mes sessions de mentorat</h2>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="text-white"
              >
                Demander une session
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            ) : sessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="mx-auto text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session planifiée</h3>
                  <p className="text-gray-600 mb-6">
                    Vous n'avez pas encore de session de mentorat à venir.
                  </p>
                  <Button onClick={() => setIsModalOpen(true)} className="text-white">
                    Demander une session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Sessions à venir</h3>
                  </CardHeader>
                  <CardContent>
                    {sessions
                      .filter(session => new Date(session.date) > new Date() && session.status !== 'cancelled')
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .length > 0 ? (
                        <div className="space-y-4">
                          {sessions
                            .filter(session => new Date(session.date) > new Date() && session.status !== 'cancelled')
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map(session => (
                              <MentoringSessionDetails key={session.id} session={session} />
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar size={32} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600">
                            Vous n'avez pas de sessions à venir.
                          </p>
                        </div>
                      )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Sessions passées</h3>
                  </CardHeader>
                  <CardContent>
                    {sessions
                      .filter(session => new Date(session.date) <= new Date() || session.status === 'cancelled')
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .length > 0 ? (
                        <div className="space-y-4">
                          {sessions
                            .filter(session => new Date(session.date) <= new Date() || session.status === 'cancelled')
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map(session => (
                              <MentoringSessionDetails key={session.id} session={session} />
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle size={32} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600">
                            Votre historique de sessions apparaîtra ici.
                          </p>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal de demande de mentorat */}
      <MentoringRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess}
      />
    </MainLayout>
  );
};

export default UserDashboardPage;