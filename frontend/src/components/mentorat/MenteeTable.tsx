import React from 'react';
import { Mentee } from '../../types/mentorat';

interface MenteeTableProps {
  demandes: Mentee[];
  onViewDetails: (demande: Mentee) => void;
  onAction: (demandeId: string, action: 'accept' | 'reject') => void;
  formatDate: (dateString: string) => string;
}

const MenteeTable: React.FC<MenteeTableProps> = ({ 
  demandes, 
  onViewDetails, 
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
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nom</th>
            <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Téléphone</th>
            <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Sujet</th>
            <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Statut</th>
            <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((demande) => (
            <tr key={demande._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px 15px' }}>{demande.full_name || 'Non spécifié'}</td>
              <td style={{ padding: '12px 15px' }}>{demande.email || 'Non spécifié'}</td>
              <td style={{ padding: '12px 15px' }}>{demande.phone || 'Non spécifié'}</td>
              <td style={{ padding: '12px 15px' }}>{demande.topic || 'Non spécifié'}</td>
              <td style={{ padding: '12px 15px' }}>{formatDate(demande.created_at)}</td>
              <td style={{ padding: '12px 15px' }}>
                <span style={getStatusStyle(demande.status)}>
                  {getStatusLabel(demande.status)}
                </span>
              </td>
              <td style={{ padding: '12px 15px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => onViewDetails(demande)}
                    style={{ padding: '5px 10px', backgroundColor: '#E3F2FD', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Détails
                  </button>
                  {demande.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => onAction(demande._id, 'accept')}
                        style={{ padding: '5px 10px', backgroundColor: '#C8E6C9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Accepter
                      </button>
                      <button 
                        onClick={() => onAction(demande._id, 'reject')}
                        style={{ padding: '5px 10px', backgroundColor: '#FFCDD2', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenteeTable;
