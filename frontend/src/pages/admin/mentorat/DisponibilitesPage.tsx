import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit, Trash2, Calendar, Check, X } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Button from '../../../components/ui/Button';
import { mentoringApi } from '../../../services/mentoringApi';
import { Availability, SpecificDateAvailability } from '../../../types/mentoring';
import toast from 'react-hot-toast';
import { format, addDays, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const DisponibilitesPage: React.FC = () => {
  const [weeklyAvailability, setWeeklyAvailability] = useState<Availability[]>([]);
  const [specificDates, setSpecificDates] = useState<SpecificDateAvailability[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddWeeklyForm, setShowAddWeeklyForm] = useState<boolean>(false);
  const [showAddSpecificDateForm, setShowAddSpecificDateForm] = useState<boolean>(false);
  const [newWeeklyAvailability, setNewWeeklyAvailability] = useState({
    day_of_week: 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    start_time: '09:00',
    end_time: '17:00',
    is_available: true
  });
  const [newSpecificDate, setNewSpecificDate] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    is_available: true,
    available_slots: [{ start_time: '09:00', end_time: '17:00' }]
  });

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const weeklyData = await mentoringApi.availability.getWeeklyAvailability();
        setWeeklyAvailability(weeklyData);
        
        // Pour l'exemple, nous ne récupérons pas les dates spécifiques ici
        // car cela nécessiterait un endpoint supplémentaire
        setSpecificDates([]);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des disponibilités:', err);
        setError('Impossible de charger les disponibilités');
        toast.error('Impossible de charger les disponibilités');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
  }, []);

  const handleAddWeeklyAvailability = async () => {
    try {
      const newAvailability = await mentoringApi.availability.createWeeklyAvailability(newWeeklyAvailability);
      setWeeklyAvailability([...weeklyAvailability, newAvailability]);
      setShowAddWeeklyForm(false);
      setNewWeeklyAvailability({
        day_of_week: 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        start_time: '09:00',
        end_time: '17:00',
        is_available: true
      });
      toast.success('Disponibilité hebdomadaire ajoutée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la disponibilité:', err);
      toast.error('Erreur lors de l\'ajout de la disponibilité');
    }
  };

  const handleDeleteWeeklyAvailability = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette disponibilité ?')) return;
    
    try {
      await mentoringApi.availability.deleteWeeklyAvailability(id);
      setWeeklyAvailability(weeklyAvailability.filter(avail => avail._id !== id));
      toast.success('Disponibilité supprimée avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression de la disponibilité:', err);
      toast.error('Erreur lors de la suppression de la disponibilité');
    }
  };

  const handleUpdateWeeklyAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const updatedAvailability = await mentoringApi.availability.updateWeeklyAvailability(id, {
        is_available: isAvailable
      });
      
      setWeeklyAvailability(weeklyAvailability.map(avail => 
        avail._id === id ? updatedAvailability : avail
      ));
      
      toast.success(`Disponibilité ${isAvailable ? 'activée' : 'désactivée'} avec succès`);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la disponibilité:', err);
      toast.error('Erreur lors de la mise à jour de la disponibilité');
    }
  };

  const handleAddSpecificDate = async () => {
    try {
      const newDateAvailability = await mentoringApi.availability.setSpecificDateAvailability(
        newSpecificDate.date,
        newSpecificDate.is_available,
        newSpecificDate.available_slots
      );
      
      setSpecificDates([...specificDates, newDateAvailability]);
      setShowAddSpecificDateForm(false);
      setNewSpecificDate({
        date: format(new Date(), 'yyyy-MM-dd'),
        is_available: true,
        available_slots: [{ start_time: '09:00', end_time: '17:00' }]
      });
      
      toast.success('Date spécifique ajoutée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la date spécifique:', err);
      toast.error('Erreur lors de l\'ajout de la date spécifique');
    }
  };

  const addSlot = () => {
    setNewSpecificDate({
      ...newSpecificDate,
      available_slots: [
        ...newSpecificDate.available_slots,
        { start_time: '09:00', end_time: '17:00' }
      ]
    });
  };

  const removeSlot = (index: number) => {
    const newSlots = [...newSpecificDate.available_slots];
    newSlots.splice(index, 1);
    setNewSpecificDate({
      ...newSpecificDate,
      available_slots: newSlots
    });
  };

  const updateSlot = (index: number, field: 'start_time' | 'end_time', value: string) => {
    const newSlots = [...newSpecificDate.available_slots];
    newSlots[index][field] = value;
    setNewSpecificDate({
      ...newSpecificDate,
      available_slots: newSlots
    });
  };

  const getDayName = (day: number) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[day];
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE d MMMM yyyy', { locale: fr });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des disponibilités</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <>
            {/* Disponibilités hebdomadaires */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Disponibilités hebdomadaires</h2>
                <Button 
                  onClick={() => setShowAddWeeklyForm(!showAddWeeklyForm)}
                  className="flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter
                </Button>
              </div>
              
              {showAddWeeklyForm && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Nouvelle disponibilité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                      <select
                        value={newWeeklyAvailability.day_of_week}
                        onChange={(e) => setNewWeeklyAvailability({
                          ...newWeeklyAvailability,
                          day_of_week: parseInt(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>Lundi</option>
                        <option value={2}>Mardi</option>
                        <option value={3}>Mercredi</option>
                        <option value={4}>Jeudi</option>
                        <option value={5}>Vendredi</option>
                        <option value={6}>Samedi</option>
                        <option value={0}>Dimanche</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                      <input
                        type="time"
                        value={newWeeklyAvailability.start_time}
                        onChange={(e) => setNewWeeklyAvailability({
                          ...newWeeklyAvailability,
                          start_time: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
                      <input
                        type="time"
                        value={newWeeklyAvailability.end_time}
                        onChange={(e) => setNewWeeklyAvailability({
                          ...newWeeklyAvailability,
                          end_time: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddWeeklyAvailability}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {weeklyAvailability.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucune disponibilité hebdomadaire définie.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jour
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Horaires
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
                      {weeklyAvailability.map((avail) => (
                        <tr key={avail._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {getDayName(avail.day_of_week)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Clock size={16} className="text-gray-400 mr-2" />
                              {avail.start_time.substring(0, 5)} - {avail.end_time.substring(0, 5)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {avail.is_available ? (
                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                Disponible
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                                Non disponible
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {avail.is_available ? (
                                <button
                                  onClick={() => handleUpdateWeeklyAvailability(avail._id, false)}
                                  className="text-yellow-600 hover:text-yellow-900"
                                  title="Désactiver"
                                >
                                  <X size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateWeeklyAvailability(avail._id, true)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Activer"
                                >
                                  <Check size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteWeeklyAvailability(avail._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Supprimer"
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
            
            {/* Dates spécifiques */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Dates spécifiques</h2>
                <Button 
                  onClick={() => setShowAddSpecificDateForm(!showAddSpecificDateForm)}
                  className="flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter
                </Button>
              </div>
              
              {showAddSpecificDateForm && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Nouvelle date spécifique</h3>
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={newSpecificDate.date}
                          onChange={(e) => setNewSpecificDate({
                            ...newSpecificDate,
                            date: e.target.value
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="inline-flex items-center mt-3">
                          <input
                            type="checkbox"
                            checked={newSpecificDate.is_available}
                            onChange={(e) => setNewSpecificDate({
                              ...newSpecificDate,
                              is_available: e.target.checked
                            })}
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">Disponible</span>
                        </label>
                      </div>
                    </div>
                    
                    {newSpecificDate.is_available && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">Créneaux horaires</h4>
                          <button
                            onClick={addSlot}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <Plus size={14} className="mr-1" />
                            Ajouter un créneau
                          </button>
                        </div>
                        
                        {newSpecificDate.available_slots.map((slot, index) => (
                          <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                            <div className="col-span-2">
                              <input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="time"
                                value={slot.end_time}
                                onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <button
                                onClick={() => removeSlot(index)}
                                className="text-red-600 hover:text-red-800"
                                disabled={newSpecificDate.available_slots.length === 1}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button onClick={handleAddSpecificDate}>
                        Ajouter cette date
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {specificDates.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucune date spécifique définie.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Créneaux
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {specificDates.map((date) => (
                        <tr key={date._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <Calendar size={16} className="text-gray-400 mr-2" />
                              {formatDate(date.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {date.is_available ? (
                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                Disponible
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                                Non disponible
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {date.is_available && date.available_slots && date.available_slots.length > 0 ? (
                              <div className="space-y-1">
                                {date.available_slots.map((slot, index) => (
                                  <div key={index} className="text-sm text-gray-500">
                                    {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {/* Implémenter la modification */}}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Modifier"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => {/* Implémenter la suppression */}}
                                className="text-red-600 hover:text-red-900"
                                title="Supprimer"
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
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DisponibilitesPage;
