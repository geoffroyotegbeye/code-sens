import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const routes = [
    { name: 'Accueil', path: '/' },
    { name: 'Formations', path: '/courses' },
    { name: 'Mentorat', path: '/mentoring' },
    { name: 'Blog', path: '/blog' },
    { name: 'À propos', path: '/about' },
  ];

  const activeClass = 'text-blue-900 font-medium';
  const inactiveClass = 'text-gray-700 hover:text-blue-900';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <span className="text-2xl font-bold tracking-tighter text-blue-900">
            Code<span className="text-teal-600">&amp;</span>Sens
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`${
                location.pathname === route.path ? activeClass : inactiveClass
              } text-sm transition-colors duration-200`}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-900">
                <span className="text-sm font-medium">
                  {user?.full_name ? user.full_name.split(' ')[0] : 'Utilisateur'}
                </span>
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user?.full_name || 'Utilisateur'} 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {user?.full_name ? (() => {
                        const nameParts = user.full_name.split(' ').filter(part => part.length > 0);
                        if (nameParts.length >= 2) {
                          // Prendre les initiales des deux premiers noms
                          return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
                        } else if (nameParts.length === 1) {
                          // S'il n'y a qu'un seul nom, prendre sa première lettre
                          return nameParts[0].charAt(0);
                        }
                        return '?';
                      })() : '?'}
                    </span>
                  </div>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Rôle: {isAdmin ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard Admin
                  </Link>
                )}
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mon Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className=" text-white ">Inscription</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-inner">
          <div className="space-y-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`${
                  location.pathname === route.path ? activeClass : inactiveClass
                } block text-base py-2`}
                onClick={closeMenu}
              >
                {route.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <hr className="my-4" />
                <div className="flex items-center space-x-2 py-2">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.full_name || 'Utilisateur'} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">
                        {user?.full_name ? (() => {
                          const nameParts = user.full_name.split(' ').filter(part => part.length > 0);
                          if (nameParts.length >= 2) {
                            return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
                          } else if (nameParts.length === 1) {
                            return nameParts[0].charAt(0);
                          }
                          return '?';
                        })() : '?'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium">{user?.full_name ? user.full_name.split(' ')[0] : 'Utilisateur'}</span>
                </div>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block py-2 text-gray-700 hover:text-blue-900"
                    onClick={closeMenu}
                  >
                    Dashboard Admin
                  </Link>
                )}
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-gray-700 hover:text-blue-900"
                  onClick={closeMenu}
                >
                  Mon Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-red-700 hover:text-red-900 py-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <hr className="my-4" />
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" fullWidth>Connexion</Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button fullWidth>Inscription</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;