import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogOut, LayoutDashboard } from 'lucide-react';
import AdminSidebar from '../admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation supérieure */}
      <div className="bg-white shadow-md fixed top-0 right-0 left-0 lg:left-64 z-10">
        <div className="flex justify-between items-center px-4 py-2">
          <h1 className="text-xl font-bold text-blue-600 hidden lg:block">Tableau de bord</h1>
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 text-gray-600 hover:text-blue-600 flex items-center">
              <Home size={20} className="mr-2" />
              <span className="hidden md:inline">Accueil</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 flex items-center"
            >
              <LogOut size={20} className="mr-2" />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen pt-12"> {/* Ajout de padding-top pour compenser la barre de navigation */}
        <AdminSidebar />
        <div className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
