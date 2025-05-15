import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Edit, PlusCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { blogApi } from '../services/blogApi';
import { BlogPost, Category } from '../types/blog';
import { uploadApi } from '../services/uploadApi';
import toast from 'react-hot-toast';

const BlogPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<(string | Category)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Récupérer les articles et les catégories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les catégories
        const categoriesData = await blogApi.getCategories();
        // Extraire les noms des catégories pour l'affichage
        const categoryNames = categoriesData.map(cat => typeof cat === 'string' ? cat : cat.name);
        setCategories(categoryNames);
        
        // Récupérer les articles
        const postsData = await blogApi.getAllPosts(0, 20, selectedCategory || undefined);
        setPosts(postsData);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        toast.error('Impossible de charger les articles');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory]);

  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Blog Code&amp;Sens
            </h1>
            <p className="text-xl text-blue-100">
              Découvrez nos articles, tutoriels et actualités sur le développement web et les nouvelles technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Admin Actions */}
          {isAdmin && (
            <div className="mb-8">
              <Link to="/admin/blog/new">
                <Button className="text-white flex items-center">
                  <PlusCircle size={18} className="mr-2" />
                  Créer un nouvel article
                </Button>
              </Link>
            </div>
          )}

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous les articles
            </button>
            {categories.map(category => {
              // Assurons-nous que category est une chaîne de caractères
              const categoryName = typeof category === 'string' ? category : category.name;
              return (
                <button
                  key={typeof category === 'string' ? category : category._id}
                  onClick={() => setSelectedCategory(categoryName)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === categoryName
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {categoryName}
                </button>
              );
            })}
          </div>

          {/* Blog Posts */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">Aucun article trouvé</p>
              {selectedCategory && (
                <p className="mt-2 text-gray-500">
                  Essayez de sélectionner une autre catégorie ou consultez tous les articles
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative h-48">
                      <img
                        src={post.cover_image ? uploadApi.getImageUrl(post.cover_image) : 'https://via.placeholder.com/800x400?text=Code%26Sens'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {typeof post.category === 'string' ? post.category : post.category.name}
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center mb-4">
                      {post.author ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                            {post.author.full_name.split(' ')
                              .slice(0, 2)
                              .map(name => name.charAt(0))
                              .join('')}
                          </div>
                          <div>
                            <p className="font-medium">{post.author.full_name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              {new Date(post.published_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <User size={20} className="mr-2 text-gray-500" />
                          <span className="text-gray-500">Auteur inconnu</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {new Date(post.updated_at).toLocaleDateString('fr-FR') !== 
                           new Date(post.published_at).toLocaleDateString('fr-FR') 
                            ? 'Mis à jour le ' + new Date(post.updated_at).toLocaleDateString('fr-FR')
                            : 'Publié le ' + new Date(post.published_at).toLocaleDateString('fr-FR')}
                        </span>
                        
                        {/* Bouton d'édition pour les administrateurs */}
                        {isAdmin && (
                          <Link to={`/admin/blog/edit/${post.slug}`} className="ml-2">
                            <button className="text-blue-600 hover:text-blue-800 flex items-center text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                              <Edit size={12} className="mr-1" />
                              Éditer
                            </button>
                          </Link>
                        )}
                      </div>
                      <div>
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded ml-1">
                            {typeof tag === 'string' ? tag : tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default BlogPage;