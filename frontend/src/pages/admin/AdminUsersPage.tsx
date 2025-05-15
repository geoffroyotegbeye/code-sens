import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Edit, Trash2, UserPlus, Shield, ShieldOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

// Interface pour les utilisateurs
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  registeredDate: string;
  lastLogin: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simuler le chargement des données
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Ceci serait normalement un appel API
        setTimeout(() => {
          setUsers([
            {
              id: '1',
              name: 'Jean Dupont',
              email: 'jean.dupont@example.com',
              role: 'admin',
              status: 'active',
              registeredDate: '2024-01-15T10:30:00',
              lastLogin: '2025-05-14T09:45:00'
            },
            {
              id: '2',
              name: 'Marie Martin',
              email: 'marie.martin@example.com',
              role: 'user',
              status: 'active',
              registeredDate: '2024-02-20T14:15:00',
              lastLogin: '2025-05-13T16:20:00'
            },
            {
              id: '3',
              name: 'Pierre Durand',
              email: 'pierre.durand@example.com',
              role: 'user',
              status: 'active',
              registeredDate: '2024-03-05T09:00:00',
              lastLogin: '2025-05-12T11:30:00'
            },
            {
              id: '4',
              name: 'Sophie Leclerc',
              email: 'sophie.leclerc@example.com',
              role: 'user',
              status: 'inactive',
              registeredDate: '2024-03-10T16:45:00',
              lastLogin: '2025-04-30T10:15:00'
            },
            {
              id: '5',
              name: 'Thomas Petit',
              email: 'thomas.petit@example.com',
              role: 'admin',
              status: 'active',
              registeredDate: '2024-01-05T08:30:00',
              lastLogin: '2025-05-14T08:00:00'
            }
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    // Simuler la suppression
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setUsers(users.filter(user => user.id !== id));
          resolve(true);
        }, 500);
      }),
      {
        loading: 'Suppression en cours...',
        success: 'Utilisateur supprimé avec succès',
        error: 'Erreur lors de la suppression'
      }
    );
  };

  const handleToggleStatus = (id: string) => {
    // Simuler la mise à jour du statut
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
    ));
    toast.success('Statut de l\'utilisateur mis à jour');
  };

  const handleToggleRole = (id: string) => {
    // Simuler la mise à jour du rôle
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' } : user
    ));
    toast.success('Rôle de l\'utilisateur mis à jour');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="w-full">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <Button className="text-white">
            <UserPlus size={16} className="mr-2" />
            Nouvel utilisateur
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 font-medium">{user.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.registeredDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleRole(user.id)}
                            className={`p-1 rounded ${
                              user.role === 'admin'
                                ? 'text-purple-600 hover:bg-purple-100'
                                : 'text-blue-600 hover:bg-blue-100'
                            }`}
                            title={user.role === 'admin' ? 'Rétrograder en utilisateur' : 'Promouvoir en administrateur'}
                          >
                            {user.role === 'admin' ? <ShieldOff size={18} /> : <Shield size={18} />}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`p-1 rounded ${
                              user.status === 'active'
                                ? 'text-red-600 hover:bg-red-100'
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                          >
                            {user.status === 'active' ? <Trash2 size={18} /> : <UserPlus size={18} />}
                          </button>
                          <button
                            className="p-1 rounded text-blue-600 hover:bg-blue-100"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
