import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { blogApi } from '../../services/blogApi';
import { BlogPost } from '../../types/blog';
import { uploadApi } from '../../services/uploadApi';
import toast from 'react-hot-toast';
import { Edit, Eye, Trash, Plus, Search, Filter } from 'lucide-react';

const BlogPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Charger les articles et les catégories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, categoriesData] = await Promise.all([
          blogApi.getAllPosts(0, 100),
          blogApi.getCategories()
        ]);
        
        setPosts(postsData);
        setFilteredPosts(postsData);
        
        // Extraire les noms de catégories uniques
        const uniqueCategories = Array.from(new Set(
          categoriesData.map(cat => cat.name)
        ));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filtrer les articles en fonction de la recherche et du filtre de catégorie
  useEffect(() => {
    if (!posts.length) return;
    
    let results = [...posts];
    
    // Appliquer le filtre de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.excerpt.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term)
      );
    }
    
    // Appliquer le filtre de catégorie
    if (categoryFilter) {
      results = results.filter(post => {
        const postCategory = typeof post.category === 'string' 
          ? post.category 
          : post.category.name;
        return postCategory === categoryFilter;
      });
    }
    
    setFilteredPosts(results);
  }, [posts, searchTerm, categoryFilter]);
  
  // Préparer la suppression d'un article
  const prepareDeletePost = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };
  
  // Supprimer un article
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      await blogApi.deletePost(postToDelete.slug);
      const updatedPosts = posts.filter(post => post.slug !== postToDelete.slug);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts.filter(post => {
        // Réappliquer les filtres actuels
        let match = true;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          match = match && (post.title.toLowerCase().includes(term) || 
                         post.excerpt.toLowerCase().includes(term) ||
                         post.content.toLowerCase().includes(term));
        }
        if (categoryFilter) {
          const postCategory = typeof post.category === 'string' 
            ? post.category 
            : post.category.name;
          match = match && (postCategory === categoryFilter);
        }
        return match;
      }));
      toast.success('Article supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      toast.error('Erreur lors de la suppression de l\'article');
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };
  
  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des articles</h1>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => navigate('/admin/blog/new')}
          >
            <Plus size={18} className="mr-2" />
            Nouvel article
          </button>
        </div>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un article..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtre par catégorie */}
            <div className="flex-shrink-0 w-full md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des articles */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    {posts.length === 0 ? 
                      'Aucun article trouvé. Créez votre premier article!' : 
                      'Aucun article ne correspond à votre recherche.'}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.cover_image && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={uploadApi.getImageUrl(post.cover_image)} 
                              alt="" 
                            />
                          </div>
                        )}
                        <div className="truncate max-w-xs">{post.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {typeof post.category === 'string' ? post.category : post.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-500">
                        {new Date(post.published_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
                          onClick={() => navigate(`/admin/blog/preview/${post.slug}`)}
                          title="Prévisualiser"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-indigo-100 text-indigo-600"
                          onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-red-100 text-red-600"
                          onClick={() => prepareDeletePost(post)}
                          title="Supprimer"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - À implémenter si nécessaire */}
        
        {/* Modal de confirmation de suppression */}
        {showDeleteModal && postToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
              <p className="mb-6">
                Êtes-vous sûr de vouloir supprimer l'article "{postToDelete.title}" ?
                Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPostToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogPostsPage;
