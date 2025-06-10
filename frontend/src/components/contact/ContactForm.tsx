import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../ui/Button';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du formulaire
    console.log('Form data:', formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Informations de contact */}
        <div className="bg-blue-900 text-white p-8 lg:p-12">
          <h3 className="text-2xl font-bold mb-6">Contactez-nous</h3>
          <p className="text-blue-100 mb-8">
            Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre parcours d'apprentissage.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-teal-400 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Email</h4>
                <a href="mailto:contact@webrichesse.com" className="text-blue-100 hover:text-white">
                  contact@webrichesse.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-teal-400 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Téléphone</h4>
                <a href="tel:+33123456789" className="text-blue-100 hover:text-white">
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-teal-400 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Adresse</h4>
                <p className="text-blue-100">
                  123 Rue de l'Innovation<br />
                  75001 Paris, France
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Sujet
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="formation">Question sur les formations</option>
                <option value="inscription">Inscription</option>
                <option value="support">Support technique</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Votre message..."
              />
            </div>

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
              <Send className="w-5 h-5 mr-2" />
              Envoyer le message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm; 