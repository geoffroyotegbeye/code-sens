import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { MentoringSession } from '../../types/mentoring';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MentoringSessionDetailsProps {
  session: MentoringSession;
}

const MentoringSessionDetails: React.FC<MentoringSessionDetailsProps> = ({ session }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const handleJoinSession = () => {
    navigate(`/mentoring/videocall/${session.id}`);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{session.notes || 'Session de mentorat'}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <Calendar size={16} className="mr-1" />
            <span className="mr-4">{formatDate(session.date)}</span>
            <Clock size={16} className="mr-1" />
            <span>{formatTime(session.date)}</span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium">Durée: {session.duration} minutes</span>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(session.status)}`}>
            {getStatusText(session.status)}
          </span>
        </div>
      </div>
      
      {session.status === 'pending' && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-md flex items-start">
          <AlertCircle size={18} className="text-yellow-600 mr-2 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Cette session est en attente de confirmation par le mentor. Vous recevrez une notification par email lorsqu'elle sera confirmée.
          </p>
        </div>
      )}
      
      {session.status === 'confirmed' && (
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleJoinSession}
            className="flex items-center text-white"
          >
            <Video size={16} className="mr-2" />
            Rejoindre la visioconférence
          </Button>
        </div>
      )}
      
      {session.status === 'cancelled' && session.cancellation_reason && (
        <div className="mt-4 p-3 bg-red-50 rounded-md flex items-start">
          <AlertCircle size={18} className="text-red-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Session annulée</p>
            <p className="text-sm text-red-600">
              Raison: {session.cancellation_reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentoringSessionDetails;
