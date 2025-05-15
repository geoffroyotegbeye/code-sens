import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Check, X, Edit, Trash2, Video, ExternalLink } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Button from '../../../components/ui/Button';
import { mentoringApi } from '../../../services/mentoringApi';
import { MentoringSession } from '../../../types/mentoring';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const sessionsData = await mentoringApi.sessions.getAllSessions();
        setSessions(sessionsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des sessions:', err);
        setError('Impossible de charger les sessions de mentorat');
        toast.error('Impossible de charger les sessions de mentorat');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessions();
  }, []);

  const handleConfirmSession = async (id: string) => {
    try {
      // Créer une salle de visioconférence
      const { roomUrl } = await mentoringApi.videoCall.createRoom(id);
      
      // Confirmer la session avec l'URL de la salle
      const updatedSession = await mentoringApi.sessions.confirmSession(id, roomUrl);
      
      // Mettre à jour la liste des sessions
      setSessions(sessions.map(session => 
        session._id === id ? updatedSession : session
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
        session._id === id ? updatedSession : session
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
        session._id === id ? updatedSession : session
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
      setSessions(sessions.filter(session => session._id !== id));
      
      toast.success('Session supprimée avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression de la session:', err);
      toast.error('Erreur lors de la suppression de la session');
    }
  };

  const filteredSessions = filterStatus === 'all' 
    ? sessions 
    : sessions.filter(session => session.status === filterStatus);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE d MMMM yyyy', { locale: fr });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Format "HH:MM" from "HH:MM:SS"
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
          </div>
        </div>

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
                  <tr key={session._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={18} className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {session.mentee_id}
                        </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900">{session.price} €</div>
                        <div className="mt-1">{getPaymentStatusBadge(session.payment_status)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {session.status === 'pending' && (
                          <button
                            onClick={() => handleConfirmSession(session._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Confirmer la session"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {(session.status === 'pending' || session.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelSession(session._id)}
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
                              onClick={() => handleCompleteSession(session._id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Marquer comme terminée"
                            >
                              <Check size={18} />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/admin/mentorat/sessions/${session._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Voir les détails"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteSession(session._id)}
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
