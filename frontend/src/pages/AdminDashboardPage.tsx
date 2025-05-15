import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen, Calendar, BarChart2, Settings, FileText, Folder, MessageSquare } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { courses, mentoringRequests } from '../data/mockData';
import { blogApi } from '../services/blogApi';
import { BlogPost, Category } from '../types/blog';
import toast from 'react-hot-toast';

// Composant pour gérer les catégories
const BlogCategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        toast.error('Erreur lors du chargement des catégories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Ajouter une catégorie
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    
    try {
      const addedCategory = await blogApi.createCategory(newCategory);
      setCategories([...categories, addedCategory]);
      setNewCategory({ name: '', description: '' });
      toast.success('Catégorie ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      toast.error('Erreur lors de l\'ajout de la catégorie');
    }
  };
  
  // Mettre à jour une catégorie
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory) return;
    
    try {
      const updatedCategory = await blogApi.updateCategory(editingCategory._id, {
        name: editingCategory.name,
        description: editingCategory.description
      });
      
      setCategories(categories.map(cat => 
        cat._id === updatedCategory._id ? updatedCategory : cat
      ));
      
      setEditingCategory(null);
      toast.success('Catégorie mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      toast.error('Erreur lors de la mise à jour de la catégorie');
    }
  };
  
  // Supprimer une catégorie
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }
    
    try {
      await blogApi.deleteCategory(id);
      setCategories(categories.filter(cat => cat._id !== id));
      toast.success('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des catégories</h2>
      </div>
      
      {/* Formulaire d'ajout de catégorie */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">{editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h3>
        <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom de la catégorie"
                value={editingCategory ? editingCategory.name : newCategory.name}
                onChange={(e) => editingCategory 
                  ? setEditingCategory({...editingCategory, name: e.target.value})
                  : setNewCategory({...newCategory, name: e.target.value})
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de la catégorie"
                value={editingCategory ? editingCategory.description || '' : newCategory.description}
                onChange={(e) => editingCategory
                  ? setEditingCategory({...editingCategory, description: e.target.value})
                  : setNewCategory({...newCategory, description: e.target.value})
                }
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {editingCategory && (
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => setEditingCategory(null)}
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingCategory ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Liste des catégories */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">Chargement...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-gray-500 mb-2">Aucune catégorie n'existe dans la base de données</p>
                    <p className="text-sm text-gray-400">Utilisez le formulaire ci-dessus pour ajouter votre première catégorie</p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.slug}</td>
                  <td className="px-6 py-4">{category.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => setEditingCategory(category)}
                    >
                      Modifier
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant pour gérer les articles de blog
const BlogPostsManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Charger les articles
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getAllPosts(0, 100);
        setPosts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        toast.error('Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Supprimer un article
  const handleDeletePost = async (slug: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    try {
      await blogApi.deletePost(slug);
      setPosts(posts.filter(post => post.slug !== slug));
      toast.success('Article supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      toast.error('Erreur lors de la suppression de l\'article');
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des articles</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => navigate('/blog/create')}
        >
          Nouvel article
        </button>
      </div>
      
      {/* Liste des articles */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de publication</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">Chargement...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">Aucun article trouvé</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {typeof post.category === 'string' ? post.category : post.category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(post.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
                    >
                      Modifier
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    >
                      Voir
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeletePost(post.slug)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant pour gérer les commentaires
const BlogCommentsManager: React.FC = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Ici, vous devriez implémenter la logique pour charger et gérer les commentaires
  // Pour l'instant, nous affichons juste un message indiquant que cette fonctionnalité est en cours de développement
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des commentaires</h2>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-lg text-gray-600">La gestion des commentaires est en cours de développement.</p>
        <p className="mt-2 text-gray-500">Cette fonctionnalité sera disponible prochainement.</p>
      </div>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
  // Rediriger vers la page de vue d'ensemble
  return <Navigate to="/admin/overview" replace />;
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'mentoring' | 'settings' | 'blog' | 'blog-categories' | 'blog-tags' | 'blog-comments'>('overview');
  
  // Stats for the overview
  const stats = {
    totalCourses: courses.length,
    totalStudents: 1245,
    totalMentoringSessions: 87,
    totalRevenue: '€52,450',
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <Link to="/admin/courses/new">
            <Button className="text-white">
              <Plus size={16} className="mr-2" />
              Nouvelle formation
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Navigation</h2>
              </div>
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                    activeTab === 'overview' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart2 size={18} className="mr-3" />
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                    activeTab === 'courses' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen size={18} className="mr-3" />
                  Formations
                </button>
                <button
                  onClick={() => setActiveTab('mentoring')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                    activeTab === 'mentoring' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar size={18} className="mr-3" />
                  Demandes de mentorat
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                    activeTab === 'settings' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={18} className="mr-3" />
                  Paramètres
                </button>
                
                {/* Section Blog */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Blog</h3>
                  
                  <Link
                    to="/admin/blog/posts"
                    className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                      activeTab === 'blog' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FileText size={18} className="mr-3" />
                    Articles
                  </Link>
                  
                  <Link
                    to="/admin/blog/categories"
                    className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                      activeTab === 'blog-categories' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Folder size={18} className="mr-3" />
                    Catégories
                  </Link>
                  

                  
                  <Link
                    to="/admin/blog/comments"
                    className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                      activeTab === 'blog-comments' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MessageSquare size={18} className="mr-3" />
                    Commentaires
                  </Link>
                </div>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'blog-categories' && <BlogCategoriesManager />}
            {activeTab === 'blog-tags' && <BlogTagsManager />}
            {activeTab === 'blog' && <BlogPostsManager />}
            {activeTab === 'blog-comments' && <BlogCommentsManager />}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Vue d'ensemble</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Formations</p>
                          <p className="text-2xl font-bold">{stats.totalCourses}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <BookOpen size={20} className="text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-teal-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-teal-600">Étudiants</p>
                          <p className="text-2xl font-bold">{stats.totalStudents}</p>
                        </div>
                        <div className="p-3 bg-teal-100 rounded-full">
                          <Users size={20} className="text-teal-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-orange-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">Sessions de mentorat</p>
                          <p className="text-2xl font-bold">{stats.totalMentoringSessions}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                          <Calendar size={20} className="text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Revenus</p>
                          <p className="text-2xl font-bold">{stats.totalRevenue}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <BarChart2 size={20} className="text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Formations récentes</h3>
                        <Link to="/admin/courses" className="text-sm text-blue-600 hover:underline">
                          Voir tout
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y">
                        {courses.slice(0, 5).map(course => (
                          <div key={course.id} className="py-3 flex items-center">
                            <img 
                              src={course.coverImage} 
                              alt={course.title} 
                              className="w-12 h-12 object-cover rounded mr-4" 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{course.title}</p>
                              <p className="text-sm text-gray-500">
                                {course.enrollmentCount} inscrits • {course.modules.reduce((acc, m) => acc + m.chapters.length, 0)} leçons
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Demandes de mentorat récentes</h3>
                        <Link to="/admin/mentoring" className="text-sm text-blue-600 hover:underline">
                          Voir tout
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y">
                        {mentoringRequests.map(request => (
                          <div key={request.id} className="py-3">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium">{request.userName}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                request.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Approuvé' : 'Refusé'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{request.topic}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Gestion des formations</h2>
                  <Link to="/admin/courses/new">
                    <Button size="sm" className="text-white">
                      <Plus size={16} className="mr-2" />
                      Nouvelle formation
                    </Button>
                  </Link>
                </div>
                
                <Card>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Formation
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Catégorie
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Créée le
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Inscrits
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {courses.map(course => (
                            <tr key={course.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img 
                                    src={course.coverImage} 
                                    alt={course.title} 
                                    className="w-10 h-10 object-cover rounded mr-3" 
                                  />
                                  <div className="text-sm font-medium text-gray-900">
                                    {course.title}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {course.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {course.enrollmentCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Link to={`/admin/courses/edit/${course.id}`} className="text-blue-600 hover:text-blue-900">
                                    Modifier
                                  </Link>
                                  <button className="text-red-600 hover:text-red-900">
                                    Supprimer
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === 'mentoring' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Demandes de mentorat</h2>
                
                <Card>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Utilisateur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sujet
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date demandée
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mentoringRequests.map(request => (
                            <tr key={request.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.userName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.topic}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.preferredDate 
                                  ? new Date(request.preferredDate).toLocaleDateString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Non spécifiée'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  request.status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : request.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Approuvé' : 'Refusé'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button className="text-green-600 hover:text-green-900">
                                    Approuver
                                  </button>
                                  <button className="text-red-600 hover:text-red-900">
                                    Refuser
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Paramètres du site</h2>
                
                <Card className="mb-6">
                  <CardHeader>
                    <h3 className="font-semibold">Informations générales</h3>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          id="site-name"
                          defaultValue="Code&Sens"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="site-description"
                          defaultValue="Plateforme de formations techniques et mentorat personnalisé"
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          defaultValue="contact@codesens.com"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="button">
                          Enregistrer les modifications
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Paramètres avancés</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Inscriptions ouvertes</h4>
                          <p className="text-sm text-gray-500">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                        </div>
                        <div className="relative inline-block w-10 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="registration-toggle" 
                            defaultChecked 
                            className="sr-only peer"
                          />
                          <label 
                            htmlFor="registration-toggle" 
                            className="block h-6 w-11 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-blue-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                          ></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Mode maintenance</h4>
                          <p className="text-sm text-gray-500">Activer le mode maintenance (site inaccessible au public)</p>
                        </div>
                        <div className="relative inline-block w-10 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="maintenance-toggle" 
                            className="sr-only peer"
                          />
                          <label 
                            htmlFor="maintenance-toggle" 
                            className="block h-6 w-11 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-blue-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                          ></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Mentorat activé</h4>
                          <p className="text-sm text-gray-500">Permettre aux utilisateurs de demander des sessions de mentorat</p>
                        </div>
                        <div className="relative inline-block w-10 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="mentoring-toggle" 
                            defaultChecked
                            className="sr-only peer"
                          />
                          <label 
                            htmlFor="mentoring-toggle" 
                            className="block h-6 w-11 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-blue-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;