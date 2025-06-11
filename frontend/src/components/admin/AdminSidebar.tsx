import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  BookOpen, 
  Users, 
  Settings, 
  FileText, 
  Folder, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  List
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [blogMenuOpen, setBlogMenuOpen] = useState(false);
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Ouvrir automatiquement le menu correspondant à la section actuelle
  useEffect(() => {
    if (isInBlogSection()) {
      setBlogMenuOpen(true);
    }
    if (isInCoursesSection()) {
      setCoursesMenuOpen(true);
    }
  }, []);
  
  const mainNavItems = [
    {
      path: '/admin/overview',
      label: 'Vue d\'ensemble',
      icon: <BarChart2 size={20} />
    },
    {
      path: '/admin/users',
      label: 'Utilisateurs',
      icon: <Users size={20} />
    }
  ];
  
  const coursesNavItems = [
    {
      path: '/admin/courses',
      label: 'Formations',
      icon: <List size={20} />
    },
    {
      path: '/admin/courses/categories',
      label: 'Catégories',
      icon: <Folder size={20} />
    }
  ];
  
  const blogNavItems = [
    {
      path: '/admin/blog/posts',
      label: 'Articles',
      icon: <FileText size={20} />
    },
    {
      path: '/admin/blog/categories',
      label: 'Catégories',
      icon: <Folder size={20} />
    },
    {
      path: '/admin/blog/comments',
      label: 'Commentaires',
      icon: <MessageSquare size={20} />
    }
  ];
  


  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isInBlogSection = () => {
    return location.pathname.includes('/admin/blog');
  };
  


  const isInCoursesSection = () => {
    return location.pathname.includes('/admin/courses');
  };

  const toggleBlogMenu = () => {
    setBlogMenuOpen(!blogMenuOpen);
    // Si on ouvre le menu blog, on ferme le menu cours pour éviter d'avoir trop de menus ouverts
    if (!blogMenuOpen) {
      setCoursesMenuOpen(false);
    }
  };
  


  const toggleCoursesMenu = () => {
    setCoursesMenuOpen(!coursesMenuOpen);
    // Si on ouvre le menu cours, on ferme le menu blog pour éviter d'avoir trop de menus ouverts
    if (!coursesMenuOpen) {
      setBlogMenuOpen(false);
    }
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md bg-blue-600 text-white shadow-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:w-64 w-3/4`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/admin/overview" className="flex items-center">
              <h1 className="text-xl font-bold text-blue-900">WebRichesse</h1>
            </Link>
            <button 
              onClick={toggleMobileSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Logo et titre */}
          <div className="p-4 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Formations section with dropdown */}
              <div className="mt-6">
                <button
                  onClick={toggleCoursesMenu}
                  className={`flex items-center justify-between w-full px-3 py-3 rounded-md transition-colors ${
                    isInCoursesSection() ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <BookOpen size={20} className="mr-3" />
                    <span className="font-medium">Formations</span>
                  </div>
                  {coursesMenuOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {coursesMenuOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {coursesNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Blog section with dropdown */}
              <div className="mt-6">
                <button
                  onClick={toggleBlogMenu}
                  className={`flex items-center justify-between w-full px-3 py-3 rounded-md transition-colors ${
                    isInBlogSection() ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <FileText size={20} className="mr-3" />
                    <span className="font-medium">Blog</span>
                  </div>
                  {blogMenuOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {blogMenuOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {blogNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Paramètres - placé tout en bas */}
              <div className="mt-6">
                <Link
                  to="/admin/settings"
                  className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                    isActive('/admin/settings')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={20} className="mr-3" />
                  <span className="font-medium">Paramètres</span>
                </Link>
              </div>

            </nav>
          </div>
          
          {/* Footer - Supprimé car nous avons maintenant la barre de navigation supérieure */}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
