import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import MenteeTable from '../../../components/mentorat/MenteeTable';
import MenteeDetails from '../../../components/mentorat/MenteeDetails';
import { Mentee } from '../../../types/mentorat';
import { getMentees, acceptMenteeRequest, rejectMenteeRequest } from '../../../services/menteeApi';

const DemandesPage: React.FC = () => {
  const [demandes, setDemandes] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedDemande, setSelectedDemande] = useState<Mentee | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Formater la date
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

  // Récupérer les demandes de mentorat
  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMentees();
      setDemandes(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      setError('Impossible de récupérer les demandes de mentorat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  // Gérer les actions (accepter/rejeter)
  const handleAction = async (demandeId: string, action: 'accept' | 'reject') => {
    try {
      setLoading(true);
      setError(null);
      
      if (action === 'accept') {
        await acceptMenteeRequest(demandeId);
      } else {
        await rejectMenteeRequest(demandeId);
      }

      setSuccessMessage(
        action === 'accept' 
          ? 'Demande de mentorat acceptée avec succès' 
          : 'Demande de mentorat rejetée'
      );
      
      // Rafraîchir la liste après action
      fetchDemandes();
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error);
      setError(`Impossible de ${action === 'accept' ? 'accepter' : 'rejeter'} la demande`);
    } finally {
      setLoading(false);
    }
  };

  // Afficher les détails d'une demande
  const handleViewDetails = (demande: Mentee) => {
    setSelectedDemande(demande);
    setShowDetails(true);
  };

  // Fermer la modal de détails
  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '20px' }}>Demandes de mentorat</h1>
        
        {successMessage && (
          <div style={{ backgroundColor: '#C8E6C9', color: '#2E7D32', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
            {successMessage}
          </div>
        )}
        
        {error && (
          <div style={{ backgroundColor: '#FFCDD2', color: '#C62828', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <p>Chargement en cours...</p>
          </div>
        ) : demandes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Aucune demande de mentorat trouvée</p>
          </div>
        ) : (
          <MenteeTable 
            demandes={demandes}
            onViewDetails={handleViewDetails}
            onAction={handleAction}
            formatDate={formatDate}
          />
        )}

        {showDetails && selectedDemande && (
          <MenteeDetails
            mentee={selectedDemande}
            onClose={handleCloseDetails}
            onAction={handleAction}
            formatDate={formatDate}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default DemandesPage;
