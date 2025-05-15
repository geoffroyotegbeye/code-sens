import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import { BarChart2, Users, BookOpen, MessageSquare } from 'lucide-react';

const AdminOverviewPage: React.FC = () => {
  // Ces données seraient normalement chargées depuis une API
  const stats = [
    { 
      title: 'Utilisateurs', 
      count: 342, 
      icon: <Users size={24} className="text-blue-500" />,
      change: '+12%'
    },
    { 
      title: 'Formations', 
      count: 28, 
      icon: <BookOpen size={24} className="text-green-500" />,
      change: '+5%'
    },
    { 
      title: 'Articles', 
      count: 156, 
      icon: <BarChart2 size={24} className="text-purple-500" />,
      change: '+18%'
    },
    { 
      title: 'Commentaires', 
      count: 487, 
      icon: <MessageSquare size={24} className="text-orange-500" />,
      change: '+24%'
    }
  ];

  return (
    <AdminLayout>
      <div className="w-full">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 rounded-full bg-gray-100">{stat.icon}</div>
                  <span className="text-sm font-medium text-green-500">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.count}</h3>
                <p className="text-gray-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Activité récente</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="font-medium">Nouvel utilisateur inscrit</p>
                  <p className="text-sm text-gray-500">Il y a 2 heures</p>
                </div>
                <div className="border-b pb-3">
                  <p className="font-medium">Nouvelle formation ajoutée</p>
                  <p className="text-sm text-gray-500">Il y a 5 heures</p>
                </div>
                <div className="border-b pb-3">
                  <p className="font-medium">Commentaire ajouté sur l'article "Introduction à React"</p>
                  <p className="text-sm text-gray-500">Il y a 8 heures</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Tâches à faire</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Répondre aux demandes de mentorat (3)</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Modérer les commentaires récents (12)</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Mettre à jour la formation "JavaScript avancé"</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Publier le nouvel article sur React</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverviewPage;
