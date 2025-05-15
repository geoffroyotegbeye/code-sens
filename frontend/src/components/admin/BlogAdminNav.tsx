import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Folder, Tag, MessageSquare } from 'lucide-react';

const BlogAdminNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
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
        <h2 className="font-semibold">Gestion du Blog</h2>
      </div>
      <nav className="flex flex-wrap p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-md mr-2 ${
              currentPath === item.path
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BlogAdminNav;
