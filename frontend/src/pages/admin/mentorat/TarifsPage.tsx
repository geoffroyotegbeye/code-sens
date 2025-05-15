import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Button from '../../../components/ui/Button';
import { mentoringApi } from '../../../services/mentoringApi';
import { MentoringPricing } from '../../../types/mentoring';
import toast from 'react-hot-toast';

const TarifsPage: React.FC = () => {
  const [pricingList, setPricingList] = useState<MentoringPricing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPricing, setNewPricing] = useState({
    duration: 60,
    price: 50,
    currency: 'EUR',
    description: 'Session de mentorat standard (1 heure)',
    is_active: true
  });

  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);
      try {
        const pricingData = await mentoringApi.pricing.getAllPricing();
        setPricingList(pricingData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des tarifs:', err);
        setError('Impossible de charger les tarifs');
        toast.error('Impossible de charger les tarifs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPricing();
  }, []);

  const handleAddPricing = async () => {
    try {
      const addedPricing = await mentoringApi.pricing.createPricing(newPricing);
      setPricingList([...pricingList, addedPricing]);
      setShowAddForm(false);
      resetForm();
      toast.success('Tarif ajouté avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'ajout du tarif:', err);
      toast.error('Erreur lors de l\'ajout du tarif');
    }
  };

  const handleUpdatePricing = async () => {
    if (!editingId) return;
    
    try {
      const updatedPricing = await mentoringApi.pricing.updatePricing(editingId, newPricing);
      
      setPricingList(pricingList.map(pricing => 
        pricing._id === editingId ? updatedPricing : pricing
      ));
      
      setEditingId(null);
      resetForm();
      toast.success('Tarif mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du tarif:', err);
      toast.error('Erreur lors de la mise à jour du tarif');
    }
  };

  const handleDeletePricing = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) return;
    
    try {
      await mentoringApi.pricing.deletePricing(id);
      setPricingList(pricingList.filter(pricing => pricing._id !== id));
      toast.success('Tarif supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression du tarif:', err);
      toast.error('Erreur lors de la suppression du tarif');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const updatedPricing = await mentoringApi.pricing.updatePricing(id, {
        is_active: isActive
      });
      
      setPricingList(pricingList.map(pricing => 
        pricing._id === id ? updatedPricing : pricing
      ));
      
      toast.success(`Tarif ${isActive ? 'activé' : 'désactivé'} avec succès`);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du tarif:', err);
      toast.error('Erreur lors de la mise à jour du tarif');
    }
  };

  const startEditing = (pricing: MentoringPricing) => {
    setNewPricing({
      duration: pricing.duration,
      price: pricing.price,
      currency: pricing.currency,
      description: pricing.description,
      is_active: pricing.is_active
    });
    setEditingId(pricing._id);
    setShowAddForm(false);
  };

  const resetForm = () => {
    setNewPricing({
      duration: 60,
      price: 50,
      currency: 'EUR',
      description: 'Session de mentorat standard (1 heure)',
      is_active: true
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    resetForm();
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

  const formatCurrency = (price: number, currency: string) => {
    switch (currency) {
      case 'EUR':
        return `${price} €`;
      case 'USD':
        return `$${price}`;
      case 'GBP':
        return `£${price}`;
      default:
        return `${price} ${currency}`;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tarifs de mentorat</h1>
          {!showAddForm && !editingId && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter un tarif
            </Button>
          )}
        </div>
        
        {/* Formulaire d'ajout/édition */}
        {(showAddForm || editingId) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {editingId ? 'Modifier le tarif' : 'Ajouter un nouveau tarif'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={newPricing.duration}
                  onChange={(e) => setNewPricing({
                    ...newPricing,
                    duration: parseInt(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={newPricing.price}
                    onChange={(e) => setNewPricing({
                      ...newPricing,
                      price: parseInt(e.target.value)
                    })}
                    className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newPricing.currency}
                    onChange={(e) => setNewPricing({
                      ...newPricing,
                      currency: e.target.value
                    })}
                    className="border border-l-0 border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  >
                    <option value="EUR">€</option>
                    <option value="USD">$</option>
                    <option value="GBP">£</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newPricing.description}
                  onChange={(e) => setNewPricing({
                    ...newPricing,
                    description: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="inline-flex items-center mt-3">
                  <input
                    type="checkbox"
                    checked={newPricing.is_active}
                    onChange={(e) => setNewPricing({
                      ...newPricing,
                      is_active: e.target.checked
                    })}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Actif</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              {editingId ? (
                <>
                  <Button onClick={cancelEditing} className="bg-gray-500 hover:bg-gray-600">
                    Annuler
                  </Button>
                  <Button onClick={handleUpdatePricing}>
                    Mettre à jour
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setShowAddForm(false)} className="bg-gray-500 hover:bg-gray-600">
                    Annuler
                  </Button>
                  <Button onClick={handleAddPricing}>
                    Ajouter
                  </Button>
                </>
              )}
            </div>
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
        ) : pricingList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Aucun tarif de mentorat défini.</p>
            <p className="text-gray-500 mt-2">Cliquez sur "Ajouter un tarif" pour commencer.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
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
                {pricingList.map((pricing) => (
                  <tr key={pricing._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock size={18} className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {formatDuration(pricing.duration)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign size={18} className="text-gray-400 mr-2" />
                        {formatCurrency(pricing.price, pricing.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{pricing.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pricing.is_active ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          Actif
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {pricing.is_active ? (
                          <button
                            onClick={() => handleToggleActive(pricing._id, false)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Désactiver"
                          >
                            <X size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(pricing._id, true)}
                            className="text-green-600 hover:text-green-900"
                            title="Activer"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => startEditing(pricing)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePricing(pricing._id)}
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
    </AdminLayout>
  );
};

export default TarifsPage;
