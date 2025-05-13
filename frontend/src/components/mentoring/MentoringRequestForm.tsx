import React, { useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const MentoringRequestForm: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    topic: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        topic: '',
        message: '',
        preferredDate: '',
        preferredTime: ''
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 px-4">
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6 inline-block">
          <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 className="text-lg font-medium">Demande envoyée avec succès!</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Nous avons bien reçu votre demande de mentorat. Notre équipe vous contactera 
          prochainement pour confirmer le rendez-vous.
        </p>
        <Button onClick={() => setSubmitted(false)}>Faire une nouvelle demande</Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6">Demande de séance de mentorat</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Sujet du mentorat
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Développement de carrière, Revue de code, etc."
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Détails de votre demande
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Expliquez votre besoin, vos attentes et tout contexte utile pour préparer la séance..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <CalendarDays size={16} className="mr-1" />
                Date souhaitée
              </div>
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                Heure souhaitée
              </div>
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une plage horaire</option>
              <option value="9h-11h">Matin (9h-11h)</option>
              <option value="11h-13h">Fin de matinée (11h-13h)</option>
              <option value="14h-16h">Après-midi (14h-16h)</option>
              <option value="16h-18h">Fin d'après-midi (16h-18h)</option>
              <option value="18h-20h">Début de soirée (18h-20h)</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting} className='text-white'>
            Envoyer ma demande
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MentoringRequestForm;