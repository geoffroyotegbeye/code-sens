import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettingsPage: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Code & Sens',
    siteDescription: 'Plateforme de formation et de mentorat pour développeurs',
    contactEmail: 'contact@code-sens.fr',
    phoneNumber: '+33 1 23 45 67 89',
    address: '123 Avenue des Développeurs, 75000 Paris'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'notifications@code-sens.fr',
    smtpPassword: '••••••••••••',
    senderName: 'Code & Sens',
    senderEmail: 'no-reply@code-sens.fr'
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: 'https://facebook.com/codesens',
    twitter: 'https://twitter.com/codesens',
    linkedin: 'https://linkedin.com/company/codesens',
    youtube: 'https://youtube.com/c/codesens',
    github: 'https://github.com/codesens'
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler la sauvegarde
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Enregistrement des paramètres généraux...',
        success: 'Paramètres généraux enregistrés avec succès',
        error: 'Erreur lors de l\'enregistrement des paramètres'
      }
    );
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler la sauvegarde
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Enregistrement des paramètres d\'email...',
        success: 'Paramètres d\'email enregistrés avec succès',
        error: 'Erreur lors de l\'enregistrement des paramètres'
      }
    );
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler la sauvegarde
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Enregistrement des paramètres sociaux...',
        success: 'Paramètres sociaux enregistrés avec succès',
        error: 'Erreur lors de l\'enregistrement des paramètres'
      }
    );
  };

  return (
    <AdminLayout>
      <div className="w-full">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Paramètres</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Paramètres généraux */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Paramètres généraux</h2>
            </div>
            <form onSubmit={handleGeneralSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={generalSettings.phoneNumber}
                    onChange={(e) => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description du site
                  </label>
                  <textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="text-white">
                  <Save size={16} className="mr-2" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>

          {/* Paramètres d'email */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Paramètres d'email</h2>
            </div>
            <form onSubmit={handleEmailSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700 mb-1">
                    Serveur SMTP
                  </label>
                  <input
                    type="text"
                    id="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                    Port SMTP
                  </label>
                  <input
                    type="text"
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom d'utilisateur SMTP
                  </label>
                  <input
                    type="text"
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe SMTP
                  </label>
                  <input
                    type="password"
                    id="smtpPassword"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'expéditeur
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email de l'expéditeur
                  </label>
                  <input
                    type="email"
                    id="senderEmail"
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="text-white">
                  <Save size={16} className="mr-2" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>

          {/* Paramètres sociaux */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Réseaux sociaux</h2>
            </div>
            <form onSubmit={handleSocialSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    value={socialSettings.facebook}
                    onChange={(e) => setSocialSettings({...socialSettings, facebook: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    value={socialSettings.twitter}
                    onChange={(e) => setSocialSettings({...socialSettings, twitter: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    value={socialSettings.linkedin}
                    onChange={(e) => setSocialSettings({...socialSettings, linkedin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube
                  </label>
                  <input
                    type="url"
                    id="youtube"
                    value={socialSettings.youtube}
                    onChange={(e) => setSocialSettings({...socialSettings, youtube: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub
                  </label>
                  <input
                    type="url"
                    id="github"
                    value={socialSettings.github}
                    onChange={(e) => setSocialSettings({...socialSettings, github: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="text-white">
                  <Save size={16} className="mr-2" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
