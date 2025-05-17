import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { mentoringApi } from '../../services/mentoringApi';

const MentoringRequestForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    topic: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.topic || !formData.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Si l'utilisateur est connecté, utiliser son ID
      if (isAuthenticated && user) {
        await mentoringApi.mentees.createMentee({
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          topic: formData.topic,
          message: formData.message
        });
      } else {
        // Si l'utilisateur n'est pas connecté, créer un mentoré sans ID utilisateur
        await mentoringApi.mentees.createMentee({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          topic: formData.topic,
          message: formData.message
        });
      }
      
      setSubmitted(true);
      toast.success('Votre demande de mentorat a été envoyée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      toast.error('Une erreur est survenue lors de l\'envoi de votre demande');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Demande envoyée avec succès</h3>
        <p className="text-gray-600 mb-4">
          Merci pour votre demande de mentorat. Nous vous contacterons très prochainement par email ou par téléphone pour organiser une session.
        </p>
        <Button 
          onClick={() => setSubmitted(false)}
          variant="outline"
          className="mr-2"
        >
          Faire une nouvelle demande
        </Button>
        <Button 
          onClick={() => navigate('/')}
        >
          Retour à l'accueil
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center">
            <User size={16} className="mr-1" />
            Nom complet
          </div>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Votre nom complet"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <Mail size={16} className="mr-1" />
              Email
            </div>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="votre@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <Phone size={16} className="mr-1" />
              Téléphone
            </div>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+33 6 XX XX XX XX"
          />
          <p className="text-xs text-gray-500 mt-1">Nous vous contacterons par téléphone ou par email pour organiser la session.</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-1" />
            Sujet du mentorat
          </div>
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
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-1" />
            Détails de votre demande
          </div>
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
      
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande de mentorat'}
        </Button>
      </div>
    </form>
  );
};

export default MentoringRequestForm;
