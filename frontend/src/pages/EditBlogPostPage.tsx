import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { blogApi } from '../services/blogApi';
import { BlogPostUpdate, BlogPost } from '../types/blog';
import toast from 'react-hot-toast';
import BlogPostForm from '../components/blog/BlogPostForm';

const EditBlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  
  // Vérifier les droits d'administration et charger les données de l'article
  useEffect(() => {
    const fetchPost = async () => {
      if (!isAdmin) {
        toast.error('Vous n\'avez pas les droits pour éditer un article');
        navigate('/blog');
        return;
      }
      
      if (!slug) {
        toast.error('Article non trouvé');
        navigate('/blog');
        return;
      }
      
      try {
        setIsLoading(true);
        const postData = await blogApi.getPostBySlug(slug);
        setPost(postData);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        toast.error('Erreur lors du chargement de l\'article');
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug, isAdmin, navigate]);
  
  // Fonction pour soumettre le formulaire
  const handleSubmit = async (formData: any) => {
    if (!slug || !post) return;
    
    try {
      setIsSubmitting(true);
      
      // Préparer les données pour l'API
      const updateData: BlogPostUpdate = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.coverImage, // Conversion du nom de propriété
        category: formData.category,
        tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
      };
      
      // Envoyer les données à l'API
      await blogApi.updatePost(slug, updateData);
      
      // Afficher un message de succès
      toast.success('Article mis à jour avec succès!');
      
      // Rediriger vers la liste des articles
      navigate('/admin/blog/posts');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      toast.error('Erreur lors de la mise à jour de l\'article. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Si les données sont en cours de chargement, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  // Si l'article n'est pas trouvé, afficher un message d'erreur
  if (!post) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Article non trouvé
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  // Préparer les données initiales du formulaire
  const initialFormData = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image || '', // Valeur par défaut si undefined
    category: typeof post.category === 'string' ? post.category : post.category.name,
    tags: post.tags.map(tag => typeof tag === 'string' ? tag : tag.name).join(', '),
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Éditer l'article</h1>
        
        <BlogPostForm
          initialData={initialFormData}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitButtonText="Mettre à jour l'article"
          cancelButtonText="Annuler"
          onCancel={() => navigate(`/admin/blog/posts`)}
        />
      </div>
    </AdminLayout>
  );
};

export default EditBlogPostPage;
