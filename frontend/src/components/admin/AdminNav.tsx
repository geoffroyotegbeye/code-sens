import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, BookOpen, Users, Calendar, Settings, FileText, Folder, Tag, MessageSquare, PlusCircle } from 'lucide-react';

const AdminNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const mainNavItems = [
    {
      path: '/admin/overview',
      label: 'Vue d\'ensemble',
      icon: <BarChart2 size={18} />
    },
    {
      path: '/admin/courses',
      label: 'Formations',
      icon: <BookOpen size={18} />
    },
    {
      path: '/admin/users',
      label: 'Utilisateurs',
      icon: <Users size={18} />
    },
    {
      path: '/admin/mentoring',
      label: 'Demandes de mentorat',
      icon: <Calendar size={18} />
    },
    {
      path: '/admin/settings',
      label: 'Paramètres',
      icon: <Settings size={18} />
    }
  ];
  
  const blogNavItems = [
    {
      path: '/admin/blog/posts',
      label: 'Articles',
      icon: <FileText size={18} />
    },
    {
      path: '/admin/blog/categories',
      label: 'Catégories',
      icon: <Folder size={18} />
    },
    {
      path: '/admin/blog/tags',
      label: 'Tags',
      icon: <Tag size={18} />
    },
    {
      path: '/admin/blog/comments',
      label: 'Commentaires',
      icon: <MessageSquare size={18} />
    }
  ];
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Navigation Admin</h2>
      </div>
      <div className="p-2">
        <div className="mb-4">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md w-full mb-1 ${
                currentPath === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="pt-2 border-t">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Blog</h3>
          <Link
            to="/admin/blog/new"
            className="flex items-center px-3 py-2 rounded-md w-full mb-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            <span className="mr-3"><PlusCircle size={18} /></span>
            Nouvel article
          </Link>
          {blogNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md w-full mb-1 ${
                currentPath === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
