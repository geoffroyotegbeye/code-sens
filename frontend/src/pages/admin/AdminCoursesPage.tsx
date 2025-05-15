import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Données temporaires pour les cours
interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number;
  published: boolean;
}

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Ceci serait normalement un appel API
        setTimeout(() => {
          setCourses([
            {
              id: '1',
              title: 'Introduction à React',
              instructor: 'Jean Dupont',
              category: 'Développement Web',
              price: 49.99,
              published: true
            },
            {
              id: '2',
              title: 'JavaScript Avancé',
              instructor: 'Marie Martin',
              category: 'Développement Web',
              price: 69.99,
              published: true
            },
            {
              id: '3',
              title: 'Node.js pour les débutants',
              instructor: 'Pierre Durand',
              category: 'Développement Backend',
              price: 59.99,
              published: false
            },
            {
              id: '4',
              title: 'Design UI/UX Moderne',
              instructor: 'Sophie Leclerc',
              category: 'Design',
              price: 79.99,
              published: true
            }
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error);
        toast.error('Erreur lors du chargement des cours');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = (id: string) => {
    // Simuler la suppression
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setCourses(courses.filter(course => course.id !== id));
          resolve(true);
        }, 500);
      }),
      {
        loading: 'Suppression en cours...',
        success: 'Formation supprimée avec succès',
        error: 'Erreur lors de la suppression'
      }
    );
  };

  const handleTogglePublish = (id: string) => {
    // Simuler la mise à jour
    setCourses(courses.map(course => 
      course.id === id ? { ...course, published: !course.published } : course
    ));
    toast.success('Statut de publication mis à jour');
  };

  return (
    <AdminLayout>
      <div className="w-full">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des formations</h1>
          <Link to="/admin/courses/new">
            <Button className="text-white">
              <Plus size={16} className="mr-2" />
              Nouvelle formation
            </Button>
          </Link>
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
                      Titre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructeur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.instructor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.price.toFixed(2)} €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(course.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            course.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {course.published ? 'Publié' : 'Brouillon'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link to={`/admin/courses/edit/${course.id}`} className="text-blue-600 hover:text-blue-900">
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
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

export default AdminCoursesPage;
