import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  FileText, 
  Folder, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Video,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [blogMenuOpen, setBlogMenuOpen] = useState(true);
  const [mentoratMenuOpen, setMentoratMenuOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const mainNavItems = [
    {
      path: '/admin/overview',
      label: 'Vue d\'ensemble',
      icon: <BarChart2 size={20} />
    },
    {
      path: '/admin/courses',
      label: 'Formations',
      icon: <BookOpen size={20} />
    },
    {
      path: '/admin/users',
      label: 'Utilisateurs',
      icon: <Users size={20} />
    },
    {
      path: '/admin/settings',
      label: 'Paramètres',
      icon: <Settings size={20} />
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
  
  const mentoratNavItems = [
    {
      path: '/admin/mentorat/demandes',
      label: 'Demandes',
      icon: <MessageSquare size={20} />
    },
    {
      path: '/admin/mentorat/sessions',
      label: 'Sessions',
      icon: <Calendar size={20} />
    },
    {
      path: '/admin/mentorat/videocall',
      label: 'Visioconférence',
      icon: <Video size={20} />
    },
    {
      path: '/admin/mentorat/tarifs',
      label: 'Tarifs',
      icon: <DollarSign size={20} />
    },
    {
      path: '/admin/mentorat/mentores',
      label: 'Mentorés',
      icon: <UserCheck size={20} />
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isInBlogSection = () => {
    return location.pathname.includes('/admin/blog');
  };
  
  const isInMentoratSection = () => {
    return location.pathname.includes('/admin/mentorat');
  };

  const toggleBlogMenu = () => {
    setBlogMenuOpen(!blogMenuOpen);
  };
  
  const toggleMentoratMenu = () => {
    setMentoratMenuOpen(!mentoratMenuOpen);
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
              <h1 className="text-xl font-bold text-blue-600">Code & Sens</h1>
            </Link>
            <button 
              onClick={toggleMobileSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Admin info */}
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
              
              {/* Mentorat section with dropdown */}
              <div className="mt-6">
                <button
                  onClick={toggleMentoratMenu}
                  className={`flex items-center justify-between w-full px-3 py-3 rounded-md transition-colors ${
                    isInMentoratSection() ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <UserCheck size={20} className="mr-3" />
                    <span className="font-medium">Mentorat</span>
                  </div>
                  {mentoratMenuOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {mentoratMenuOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {mentoratNavItems.map((item) => (
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
            </nav>
          </div>
          
          {/* Footer - Supprimé car nous avons maintenant la barre de navigation supérieure */}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
