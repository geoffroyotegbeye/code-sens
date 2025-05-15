import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Check, X, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Interface pour les demandes de mentorat
interface MentoringRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminMentoringPage: React.FC = () => {
  const [requests, setRequests] = useState<MentoringRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<MentoringRequest | null>(null);

  useEffect(() => {
    // Simuler le chargement des données
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Ceci serait normalement un appel API
        setTimeout(() => {
          setRequests([
            {
              id: '1',
              name: 'Thomas Dubois',
              email: 'thomas.dubois@example.com',
              subject: 'Demande de mentorat en développement React',
              message: 'Bonjour, je suis développeur junior et j\'aimerais être accompagné pour améliorer mes compétences en React. J\'ai déjà réalisé quelques projets personnels mais j\'ai besoin de conseils pour progresser.',
              date: '2025-05-10T14:30:00',
              status: 'pending'
            },
            {
              id: '2',
              name: 'Julie Martin',
              email: 'julie.martin@example.com',
              subject: 'Accompagnement pour projet professionnel',
              message: 'Je travaille actuellement sur un projet d\'application web pour mon entreprise et j\'ai besoin de conseils sur l\'architecture et les bonnes pratiques à mettre en place.',
              date: '2025-05-12T09:15:00',
              status: 'approved'
            },
            {
              id: '3',
              name: 'Alexandre Petit',
              email: 'alex.petit@example.com',
              subject: 'Reconversion professionnelle',
              message: 'Je suis en reconversion professionnelle et je souhaite me diriger vers le développement web. J\'aimerais avoir des conseils sur le parcours à suivre et les compétences à acquérir en priorité.',
              date: '2025-05-13T16:45:00',
              status: 'pending'
            },
            {
              id: '4',
              name: 'Sophie Leroy',
              email: 'sophie.leroy@example.com',
              subject: 'Aide pour projet personnel',
              message: 'Je développe une application mobile en React Native et je rencontre des difficultés avec la gestion de l\'état. J\'aimerais avoir des conseils pour améliorer mon code.',
              date: '2025-05-14T11:20:00',
              status: 'rejected'
            }
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erreur lors du chargement des demandes:', error);
        toast.error('Erreur lors du chargement des demandes de mentorat');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
    toast.success('Demande approuvée');
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
    toast.success('Demande rejetée');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="w-full">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Demandes de mentorat</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white shadow rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sujet
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
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
                      {requests.map((request) => (
                        <tr 
                          key={request.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{request.name}</div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 truncate max-w-xs">{request.subject}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(request.date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status === 'approved' 
                                ? 'Approuvée' 
                                : request.status === 'rejected'
                                ? 'Rejetée'
                                : 'En attente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(request.id);
                                }}
                                disabled={request.status !== 'pending'}
                                className={`p-1 rounded ${
                                  request.status === 'pending'
                                    ? 'text-green-600 hover:bg-green-100'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(request.id);
                                }}
                                disabled={request.status !== 'pending'}
                                className={`p-1 rounded ${
                                  request.status === 'pending'
                                    ? 'text-red-600 hover:bg-red-100'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <X size={18} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Ouvrir une fenêtre de messagerie
                                  window.open(`mailto:${request.email}?subject=Re: ${request.subject}`);
                                }}
                                className="p-1 rounded text-blue-600 hover:bg-blue-100"
                              >
                                <MessageCircle size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-1/3">
            {selectedRequest ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Détails de la demande</h3>
                  <p className="text-sm text-gray-500">{formatDate(selectedRequest.date)}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">De</h4>
                  <p className="font-medium">{selectedRequest.name}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.email}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">Sujet</h4>
                  <p>{selectedRequest.subject}</p>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500">Message</h4>
                  <p className="text-sm whitespace-pre-line">{selectedRequest.message}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={selectedRequest.status !== 'pending'}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedRequest.status === 'pending'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Check size={16} className="mr-2" />
                    Approuver
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={selectedRequest.status !== 'pending'}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedRequest.status === 'pending'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <X size={16} className="mr-2" />
                    Rejeter
                  </button>
                  <button
                    onClick={() => window.open(`mailto:${selectedRequest.email}?subject=Re: ${selectedRequest.subject}`)}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center"
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Répondre
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Sélectionnez une demande pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMentoringPage;
