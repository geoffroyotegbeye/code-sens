import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, BookOpen, Users, Code, MessageSquare, ChevronDown, Settings, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
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
    { 
      name: 'Formations', 
      path: '/courses',
      icon: <BookOpen size={18} className="mr-2" />
    },
    { 
      name: 'Mentorat', 
      path: '/mentoring',
      icon: <Users size={18} className="mr-2" />
    },
    { 
      name: 'Blog', 
      path: '/blog',
      icon: <MessageSquare size={18} className="mr-2" />
    },
  ];

  const activeClass = 'text-teal-500 font-medium';
  const inactiveClass = 'text-gray-700 hover:text-teal-500';

  // Fermer le menu utilisateur quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
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
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-teal-600">
              WebRichesse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {routes.map(route => (
              <Link
                key={route.path}
                to={route.path}
                className={`flex items-center ${location.pathname === route.path ? activeClass : inactiveClass}`}
              >
                {route.icon}
                {route.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {getUserInitials()}
                  </div>
                  <span className="font-medium">{user?.full_name}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings size={16} className="mr-2" />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-teal-500"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {routes.map(route => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`flex items-center ${location.pathname === route.path ? activeClass : inactiveClass}`}
                  onClick={closeMenu}
                >
                  {route.icon}
                  {route.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      {getUserInitials()}
                    </div>
                    <span className="font-medium">{user?.full_name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => closeMenu()}
                  >
                    <LayoutDashboard size={18} className="mr-2" />
                    Tableau de bord
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => closeMenu()}
                  >
                    <User size={18} className="mr-2" />
                    Mon profil
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => closeMenu()}
                    >
                      <Settings size={18} className="mr-2" />
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                  >
                    <LogOut size={18} className="mr-2" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full bg-teal-500 hover:bg-teal-600">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;