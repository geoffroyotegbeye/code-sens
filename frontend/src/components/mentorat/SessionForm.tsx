import React, { useState, useEffect } from 'react';
import { mentoringApi } from '../../services/mentoringApi';
import { MentoringSessionCreate, Mentee } from '../../types/mentoring';
import toast from 'react-hot-toast';

interface SessionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ onSuccess, onCancel }) => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<MentoringSessionCreate>>({
    mentee_ids: [],
    date: '',
    duration: 60,
    status: 'pending',
    price: 0
  });

  // Charger les mentorés
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const menteesData = await mentoringApi.mentees.getAllMentees();
        setMentees(menteesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Impossible de charger les données nécessaires');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      duration
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mentee_ids || formData.mentee_ids.length === 0 || !formData.date) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsLoading(true);
    try {
      // Formater la date correctement pour l'API
      const sessionData = {
        ...formData,
        date: new Date(formData.date as string).toISOString(),
        // Valeurs par défaut pour les champs requis par l'API
        pricing_id: '000000000000000000000000',
        price: 0,
        // Pour rétrocompatibilité, on garde mentee_id comme le premier de la liste
        mentee_id: formData.mentee_ids && formData.mentee_ids.length > 0 ? formData.mentee_ids[0] : undefined
      } as MentoringSessionCreate;
      
      await mentoringApi.sessions.createSession(sessionData);
      toast.success('Session créée avec succès');
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      toast.error('Erreur lors de la création de la session');
    } finally {
      setIsLoading(false);
    }
  };

  // Formater la date minimale (aujourd'hui) pour l'input date
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Créer une nouvelle session</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mentee_ids">
              Mentoré(s) *
            </label>
            <div className="relative">
              <select
                id="mentee_ids"
                name="mentee_ids"
                multiple
                value={formData.mentee_ids as string[]}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({
                    ...prev,
                    mentee_ids: selectedOptions
                  }));
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[120px]"
                required
              >
                {mentees
                  .filter(mentee => mentee.status === 'accepted') // Ne montrer que les mentorés acceptés
                  .map(mentee => (
                    <option key={mentee.id} value={mentee.id}>
                      {mentee.full_name || mentee.email || `Mentoré #${mentee.id}`}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs mentorés</p>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date et heure *
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              min={minDate}
              value={formData.date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
              Durée (minutes) *
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleDurationChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 heure</option>
              <option value="90">1 heure 30</option>
              <option value="120">2 heures</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? 'Création...' : 'Créer la session'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SessionForm;
