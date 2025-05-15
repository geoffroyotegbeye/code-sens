import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Calendar, ExternalLink, Mail, Phone } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Button from '../../../components/ui/Button';
import { mentoringApi } from '../../../services/mentoringApi';
import { Mentee, MentoringSession } from '../../../types/mentoring';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MentoresPage: React.FC = () => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [sessions, setSessions] = useState<{ [menteeId: string]: MentoringSession[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);

  useEffect(() => {
    const fetchMentees = async () => {
      setIsLoading(true);
      try {
        const menteesData = await mentoringApi.mentees.getAllMentees();
        setMentees(menteesData);
        
        // Pour chaque mentoré, récupérer ses sessions
        const sessionsMap: { [menteeId: string]: MentoringSession[] } = {};
        for (const mentee of menteesData) {
          try {
            const menteeSessions = await mentoringApi.sessions.getSessionsByMenteeId(mentee._id);
            sessionsMap[mentee._id] = menteeSessions;
          } catch (err) {
            console.error(`Erreur lors du chargement des sessions pour ${mentee._id}:`, err);
          }
        }
        
        setSessions(sessionsMap);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des mentorés:', err);
        setError('Impossible de charger les mentorés');
        toast.error('Impossible de charger les mentorés');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMentees();
  }, []);

  const handleSelectMentee = (mentee: Mentee) => {
    setSelectedMentee(mentee === selectedMentee ? null : mentee);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: fr });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Format "HH:MM" from "HH:MM:SS"
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes === 60) {
      return '1 heure';
    } else if (minutes % 60 === 0) {
      return `${minutes / 60} heures`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins}`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">En attente</span>;
      case 'confirmed':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Confirmée</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Annulée</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">Terminée</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">Inconnu</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des mentorés</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : mentees.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Aucun mentoré trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des mentorés */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-700">Mentorés</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {mentees.map((mentee) => (
                    <div 
                      key={mentee._id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedMentee?._id === mentee._id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelectMentee(mentee)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {mentee.profile_picture ? (
                            <img 
                              src={mentee.profile_picture} 
                              alt={mentee.full_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {mentee.full_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{mentee.full_name}</p>
                          <p className="text-sm text-gray-500">{mentee.email}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            <span>{mentee.sessions_count} sessions ({formatDuration(mentee.total_session_time)})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Détails du mentoré sélectionné */}
            <div className="lg:col-span-2">
              {selectedMentee ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {selectedMentee.profile_picture ? (
                          <img 
                            src={selectedMentee.profile_picture} 
                            alt={selectedMentee.full_name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                            {selectedMentee.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="ml-4">
                          <h2 className="text-xl font-bold text-gray-900">{selectedMentee.full_name}</h2>
                          <div className="flex items-center mt-1 text-gray-500">
                            <Mail size={16} className="mr-1" />
                            <a href={`mailto:${selectedMentee.email}`} className="text-blue-600 hover:underline">
                              {selectedMentee.email}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="flex items-center">
                          <Mail size={16} className="mr-1" />
                          Contacter
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Informations générales */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Informations</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-500">Niveau</p>
                            <p className="text-sm text-gray-900">
                              {selectedMentee.skills_level === 'beginner' && 'Débutant'}
                              {selectedMentee.skills_level === 'intermediate' && 'Intermédiaire'}
                              {selectedMentee.skills_level === 'advanced' && 'Avancé'}
                            </p>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-500">Intérêts</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedMentee.interests && selectedMentee.interests.length > 0 ? (
                                selectedMentee.interests.map((interest, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
                                  >
                                    {interest}
                                  </span>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">Aucun intérêt spécifié</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Objectifs</p>
                            <p className="text-sm text-gray-900 whitespace-pre-line">
                              {selectedMentee.goals || 'Aucun objectif spécifié'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Statistiques */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Statistiques</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm font-medium text-gray-500">Sessions</p>
                              <p className="text-2xl font-bold text-blue-600">{selectedMentee.sessions_count}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm font-medium text-gray-500">Temps total</p>
                              <p className="text-2xl font-bold text-blue-600">{formatDuration(selectedMentee.total_session_time)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm font-medium text-gray-500">Première session</p>
                              <p className="text-sm font-medium text-gray-900">
                                {sessions[selectedMentee._id] && sessions[selectedMentee._id].length > 0 
                                  ? formatDate(sessions[selectedMentee._id][sessions[selectedMentee._id].length - 1].date)
                                  : '-'
                                }
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm font-medium text-gray-500">Dernière session</p>
                              <p className="text-sm font-medium text-gray-900">
                                {sessions[selectedMentee._id] && sessions[selectedMentee._id].length > 0 
                                  ? formatDate(sessions[selectedMentee._id][0].date)
                                  : '-'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sessions */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Sessions</h3>
                      {sessions[selectedMentee._id] && sessions[selectedMentee._id].length > 0 ? (
                        <div className="bg-white border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Sujet
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Statut
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {sessions[selectedMentee._id].map((session) => (
                                <tr key={session._id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                      <div className="flex items-center text-sm text-gray-900">
                                        <Calendar size={16} className="text-gray-400 mr-2" />
                                        {formatDate(session.date)}
                                      </div>
                                      <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <Clock size={16} className="text-gray-400 mr-2" />
                                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{session.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{session.description}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(session.status)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                      to={`/admin/mentorat/sessions/${session._id}`}
                                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                    >
                                      <ExternalLink size={16} className="mr-1" />
                                      Détails
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-gray-500">Aucune session pour ce mentoré</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Notes */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Notes</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <textarea
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          placeholder="Ajoutez des notes privées sur ce mentoré..."
                        />
                        <div className="flex justify-end mt-2">
                          <Button>
                            Enregistrer les notes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600">Sélectionnez un mentoré pour voir ses détails</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MentoresPage;
