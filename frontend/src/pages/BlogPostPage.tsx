import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Share2, Edit, Trash2 } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { blogApi } from '../services/blogApi';
import { BlogPost } from '../types/blog';
import toast from 'react-hot-toast';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const postData = await blogApi.getPostBySlug(slug);
        setPost(postData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'article:', err);
        setError('Impossible de charger l\'article');
        toast.error('Impossible de charger l\'article');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  const handleShare = () => {
    if (navigator.share && window.location.href) {
      navigator.share({
        title: post?.title || 'Article Code&Sens',
        text: post?.excerpt || 'Découvrez cet article sur Code&Sens',
        url: window.location.href,
      }).catch(err => {
        console.error('Erreur lors du partage:', err);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papier');
    }
  };
  
  const handleDeletePost = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        if (!slug) return;
        await blogApi.deletePost(slug);
        toast.success('Article supprimé avec succès');
        navigate('/blog');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Impossible de supprimer l\'article');
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Article non trouvé</h2>
          <p className="text-gray-600 mb-8">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link to="/blog">
            <Button className="text-white">Retour au blog</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="pb-16">
        {/* Hero Section */}
        <div className="relative h-96 bg-blue-900">
          <img
            src={post.cover_image || 'https://via.placeholder.com/800x400?text=Code%26Sens'}
            alt={post.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container px-4 text-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center mr-6">
                  {post.author && (
                    <>
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                        {post.author.full_name.split(' ')
                          .slice(0, 2)
                          .map(name => name.charAt(0))
                          .join('')}
                      </div>
                      <span>{post.author.full_name}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  {new Date(post.published_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="bg-blue-600 px-3 py-1 rounded">{post.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex justify-end mb-6 space-x-3">
                <Link to={`/blog/edit/${post.slug}`}>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDeletePost}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  Supprimer
                </Button>
              </div>
            )}
            
            {/* Content */}
            <div className="prose prose-lg max-w-none blog-content">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }} 
                className="blog-content-inner"
              />
            </div>
            
            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Share */}
            <div className="mt-8 border-t border-b border-gray-200 py-4">
              <div className="flex items-center">
                <span className="font-medium mr-4">Partager:</span>
                <button 
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  );
};

export default BlogPostPage;
