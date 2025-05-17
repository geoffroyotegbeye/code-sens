import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Check, X, Trash2, Video, ExternalLink, Plus } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Button from '../../../components/ui/Button';
import { mentoringApi } from '../../../services/mentoringApi';
import { MentoringSession, Mentee } from '../../../types/mentoring';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import SessionForm from '../../../components/mentorat/SessionForm';

const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [mentees, setMentees] = useState<Mentee[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sessionsData, menteesData] = await Promise.all([
          mentoringApi.sessions.getAllSessions(),
          mentoringApi.mentees.getAllMentees()
        ]);
        setSessions(sessionsData);
        setMentees(menteesData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données');
        toast.error('Impossible de charger les données');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleConfirmSession = async (id: string) => {
    try {
      // Créer une salle de visioconférence
      const { roomUrl } = await mentoringApi.videoCall.createRoom(id);
      
      // Confirmer la session avec l'URL de la salle
      const updatedSession = await mentoringApi.sessions.confirmSession(id, roomUrl);
      
      // Mettre à jour la liste des sessions
      setSessions(sessions.map(session => 
        session.id === id ? updatedSession : session
      ));
      
      toast.success('Session confirmée avec succès');
    } catch (err) {
      console.error('Erreur lors de la confirmation de la session:', err);
      toast.error('Erreur lors de la confirmation de la session');
    }
  };

  const handleCancelSession = async (id: string) => {
    const reason = window.prompt('Raison de l\'annulation:');
    if (reason === null) return;
    
    try {
      const updatedSession = await mentoringApi.sessions.cancelSession(id, reason);
      
      // Mettre à jour la liste des sessions
      setSessions(sessions.map(session => 
        session.id === id ? updatedSession : session
      ));
      
      toast.success('Session annulée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la session:', err);
      toast.error('Erreur lors de l\'annulation de la session');
    }
  };

  const handleCompleteSession = async (id: string) => {
    const notes = window.prompt('Notes sur la session:');
    if (notes === null) return;
    
    try {
      const updatedSession = await mentoringApi.sessions.completeSession(id, notes);
      
      // Mettre à jour la liste des sessions
      setSessions(sessions.map(session => 
        session.id === id ? updatedSession : session
      ));
      
      toast.success('Session marquée comme terminée');
    } catch (err) {
      console.error('Erreur lors de la complétion de la session:', err);
      toast.error('Erreur lors de la complétion de la session');
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) return;
    
    try {
      await mentoringApi.sessions.deleteSession(id);
      
      // Mettre à jour la liste des sessions
      setSessions(sessions.filter(session => session.id !== id));
      
      toast.success('Session supprimée avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression de la session:', err);
      toast.error('Erreur lors de la suppression de la session');
    }
  };
  
  const handleCreateSuccess = async () => {
    setShowCreateForm(false);
    setIsLoading(true);
    try {
      const sessionsData = await mentoringApi.sessions.getAllSessions();
      setSessions(sessionsData);
      toast.success('Session créée avec succès');
    } catch (err) {
      console.error('Erreur lors du rechargement des sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = filterStatus === 'all' 
    ? sessions 
    : sessions.filter(session => session.status === filterStatus);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE d MMMM yyyy', { locale: fr });
  };

  // Calculer l'heure de début et de fin à partir de la date et de la durée
  const getSessionTimes = (dateString: string, durationMinutes: number) => {
    const date = new Date(dateString);
    const startHour = date.getHours().toString().padStart(2, '0');
    const startMinute = date.getMinutes().toString().padStart(2, '0');
    
    const endDate = new Date(date.getTime() + durationMinutes * 60000);
    const endHour = endDate.getHours().toString().padStart(2, '0');
    const endMinute = endDate.getMinutes().toString().padStart(2, '0');
    
    return {
      startTime: `${startHour}:${startMinute}`,
      endTime: `${endHour}:${endMinute}`
    };
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">En attente</span>;
      case 'paid':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Payé</span>;
      case 'refunded':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Remboursé</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">Inconnu</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sessions de mentorat</h1>
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les sessions</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="cancelled">Annulées</option>
              <option value="completed">Terminées</option>
            </select>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} className="mr-1" />
              Nouvelle session
            </Button>
          </div>
        </div>
        
        {showCreateForm && (
          <div className="mb-6">
            <SessionForm 
              onSuccess={handleCreateSuccess} 
              onCancel={() => setShowCreateForm(false)} 
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Aucune session de mentorat trouvée.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentoré
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sujet
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {/* Si nous avons des mentees dans la session (nouveau format) */}
                        {session.mentees && session.mentees.length > 0 ? (
                          session.mentees.map((mentee, index) => (
                            <div key={index} className="flex items-center mb-1 last:mb-0">
                              <User size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                              <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                {mentee.full_name || mentee.email || `Mentoré #${mentee.id || 'inconnu'}`}
                              </div>
                            </div>
                          ))
                        ) : (
                          /* Format rétrocompatible avec un seul mentoré */
                          <div className="flex items-center">
                            <User size={18} className="text-gray-400 mr-2" />
                            <div className="text-sm font-medium text-gray-900">
                              {mentees.find(m => m.id === session.mentee_id)?.full_name || session.mentee_id}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          {formatDate(session.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock size={16} className="text-gray-400 mr-2" />
                          {getSessionTimes(session.date, session.duration).startTime} - {getSessionTimes(session.date, session.duration).endTime}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900">{session.duration} minutes</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {session.status === 'pending' && (
                          <button
                            onClick={() => handleConfirmSession(session.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Confirmer la session"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {(session.status === 'pending' || session.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelSession(session.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Annuler la session"
                          >
                            <X size={18} />
                          </button>
                        )}
                        {session.status === 'confirmed' && (
                          <>
                            <a
                              href={session.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                              title="Rejoindre la visioconférence"
                            >
                              <Video size={18} />
                            </a>
                            <button
                              onClick={() => handleCompleteSession(session.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Marquer comme terminée"
                            >
                              <Check size={18} />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/admin/mentorat/sessions/${session.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Voir les détails"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer la session"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SessionsPage;
