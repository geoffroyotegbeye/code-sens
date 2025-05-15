import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { blogApi } from '../services/blogApi';
import toast from 'react-hot-toast';
import BlogPostForm from '../components/blog/BlogPostForm';

const CreateBlogPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Vérifier les droits d'administration au chargement de la page
  useEffect(() => {
    if (!isAdmin) {
      toast.error('Vous n\'avez pas les droits pour créer un article');
      navigate('/blog');
    }
  }, [isAdmin, navigate]);

  // Données initiales du formulaire
  const initialFormData = {
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (formData: typeof initialFormData) => {
    try {
      setIsSubmitting(true);
      
      // Vérifier que l'utilisateur est connecté
      if (!user) {
        toast.error('Vous devez être connecté pour créer un article');
        navigate('/login');
        return;
      }
      
      // Préparer les données pour l'API
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.coverImage, // Conversion du nom de propriété
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        // Générer un slug à partir du titre
        slug: formData.title.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
          .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
          .replace(/[\s_]+/g, '-') // Remplacer les espaces et underscores par des tirets
          .replace(/^-+|-+$/g, ''), // Supprimer les tirets en début et fin
        // Ajouter l'ID de l'auteur
        author_id: user.id
      };
      
      // Envoyer les données à l'API
      await blogApi.createPost(postData);
      
      // Afficher un message de succès
      toast.success('Article créé avec succès!');
      
      // Rediriger vers la liste des articles
      navigate('/admin/blog/posts');
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      toast.error('Erreur lors de la création de l\'article. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Créer un nouvel article</h1>
        
        <BlogPostForm
          initialData={initialFormData}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitButtonText="Publier l'article"
          cancelButtonText="Annuler"
          onCancel={() => navigate('/admin/blog/posts')}
        />
      </div>
    </AdminLayout>
  );
};

export default CreateBlogPostPage;
