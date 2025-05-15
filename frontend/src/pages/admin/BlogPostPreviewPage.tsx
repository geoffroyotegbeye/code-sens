import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { blogApi } from '../../services/blogApi';
import { BlogPost } from '../../types/blog';
import { uploadApi } from '../../services/uploadApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash } from 'lucide-react';

const BlogPostPreviewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await blogApi.getPostBySlug(slug);
        setPost(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        toast.error('Erreur lors du chargement de l\'article');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);

  const handleDeletePost = async () => {
    if (!post) return;
    
    try {
      await blogApi.deletePost(post.slug);
      toast.success('Article supprimé avec succès');
      navigate('/admin/blog/posts');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      toast.error('Erreur lors de la suppression de l\'article');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Article non trouvé</h1>
            <p className="mb-4">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <button
              onClick={() => navigate('/admin/blog/posts')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retour à la liste des articles
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Barre d'actions */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={() => navigate('/admin/blog/posts')}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour à la liste
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Edit size={16} className="mr-2" />
              Modifier
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Trash size={16} className="mr-2" />
              Supprimer
            </button>
          </div>
        </div>
        
        {/* Contenu de l'article */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.cover_image && (
            <div className="w-full h-80 overflow-hidden">
              <img
                src={uploadApi.getImageUrl(post.cover_image)}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center mb-6 text-sm text-gray-600">
              <span className="mr-4">
                Publié le {new Date(post.published_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              
              <span className="mr-4">
                Catégorie: {typeof post.category === 'string' ? post.category : post.category.name}
              </span>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap mt-2 md:mt-0">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                    >
                      {typeof tag === 'string' ? tag : tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {post.excerpt && (
              <div className="mb-6 italic text-gray-600 border-l-4 border-blue-500 pl-4 py-2">
                {post.excerpt}
              </div>
            )}
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/src="\/static\/uploads/g, src => {
                  // Extraire le chemin d'image et utiliser uploadApi.getImageUrl
                  const path = src.replace('src="', '');
                  return `src="${uploadApi.getImageUrl(path)}`;
                }) 
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer l'article "{post.title}" ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
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
    </AdminLayout>
  );
};

export default BlogPostPreviewPage;
