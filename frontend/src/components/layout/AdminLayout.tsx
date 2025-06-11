import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import AdminSidebar from '../admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
  };
  
  // Fermer le menu utilisateur quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user?.full_name) return '?';
    const names = user.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation supérieure */}
      <div className="bg-white shadow-md fixed top-0 right-0 left-0 lg:left-64 z-10">
        <div className="flex justify-between items-center px-4 py-2">
          <h1 className="text-xl font-bold text-blue-900 hidden lg:block">Tableau de bord</h1>
          <div className="flex items-center space-x-4">
            
            {/* Menu utilisateur avec dropdown */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-900 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {getUserInitials()}
                  </div>
                  <span className="font-medium hidden md:inline">{user.full_name}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Home size={16} className="mr-2" />
                      Accueil
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LayoutDashboard size={16} className="mr-2" />
                      Tableau de bord
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} className="mr-2" />
                      Mon profil
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}
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
