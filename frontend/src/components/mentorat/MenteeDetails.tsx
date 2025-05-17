import React from 'react';
import { Mentee } from '../../types/mentorat';

interface MenteeDetailsProps {
  mentee: Mentee;
  onClose: () => void;
  onAction: (demandeId: string, action: 'accept' | 'reject') => void;
  formatDate: (dateString: string) => string;
}

const MenteeDetails: React.FC<MenteeDetailsProps> = ({
  mentee,
  onClose,
  onAction,
  formatDate
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Rejetée';
      default: return 'Inconnu';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#FFF9C4', color: '#F57F17', padding: '5px 10px', borderRadius: '4px', display: 'inline-block' };
      case 'accepted': return { backgroundColor: '#C8E6C9', color: '#2E7D32', padding: '5px 10px', borderRadius: '4px', display: 'inline-block' };
      case 'rejected': return { backgroundColor: '#FFCDD2', color: '#C62828', padding: '5px 10px', borderRadius: '4px', display: 'inline-block' };
      default: return { backgroundColor: '#E0E0E0', color: '#616161', padding: '5px 10px', borderRadius: '4px', display: 'inline-block' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Détails de la demande</h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Nom:</strong> {mentee.full_name || 'Non spécifié'}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Email:</strong> {mentee.email || 'Non spécifié'}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Téléphone:</strong> {mentee.phone || 'Non spécifié'}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Sujet:</strong> {mentee.topic || 'Non spécifié'}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Message:</strong>
          <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {mentee.message || 'Aucun message'}
          </p>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Date de création:</strong> {formatDate(mentee.created_at)}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <strong>Statut:</strong> 
          <span style={{ ...getStatusStyle(mentee.status), marginLeft: '10px' }}>
            {getStatusLabel(mentee.status)}
          </span>
        </div>
        
        {mentee.status === 'pending' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button 
              onClick={() => {
                onAction(mentee._id, 'accept');
                onClose();
              }}
              style={{ padding: '8px 16px', backgroundColor: '#C8E6C9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Accepter
            </button>
            <button 
              onClick={() => {
                onAction(mentee._id, 'reject');
                onClose();
              }}
              style={{ padding: '8px 16px', backgroundColor: '#FFCDD2', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenteeDetails;
