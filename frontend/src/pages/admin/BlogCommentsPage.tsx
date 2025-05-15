import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { blogApi } from '../../services/blogApi';
import toast from 'react-hot-toast';

interface Comment {
  _id: string;
  content: string;
  post_id: string;
  post_title?: string;
  author_id: string;
  author_name?: string;
  created_at: string;
}

const BlogCommentsPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<{_id: string, title: string}[]>([]);
  
  // Charger les articles et commentaires
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger les articles
        const postsData = await blogApi.getAllPosts(0, 100);
        setPosts(postsData.map(post => ({_id: post._id, title: post.title})));
        
        // Charger les commentaires (simulation pour le moment)
        // Dans une implémentation réelle, vous utiliseriez une API pour récupérer tous les commentaires
        // Exemple: const commentsData = await blogApi.getAllComments();
        
        // Pour l'instant, nous simulons des commentaires
        const mockComments: Comment[] = [];
        for (const post of postsData.slice(0, 3)) {
          mockComments.push({
            _id: `comment-${post._id}-1`,
            content: `Commentaire sur l'article "${post.title}"`,
            post_id: post._id,
            post_title: post.title,
            author_id: 'user-1',
            author_name: 'Utilisateur Test',
            created_at: new Date().toISOString()
          });
        }
        
        setComments(mockComments);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Supprimer un commentaire
  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }
    
    try {
      // Dans une implémentation réelle, vous appelleriez l'API pour supprimer le commentaire
      // Exemple: await blogApi.deleteComment(id);
      
      // Pour l'instant, nous simulons la suppression
      setComments(comments.filter(comment => comment._id !== id));
      toast.success('Commentaire supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      toast.error('Erreur lors de la suppression du commentaire');
    }
  };
  
  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des commentaires</h1>
        </div>
        
        {/* Notification de fonctionnalité en développement */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Cette fonctionnalité est en cours de développement. Les données affichées sont simulées à des fins de démonstration.
              </p>
            </div>
          </div>
        </div>
        
        {/* Liste des commentaires */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">Chargement...</td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">Aucun commentaire trouvé</td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment._id}>
                    <td className="px-6 py-4">{comment.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{comment.post_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{comment.author_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteComment(comment._id)}
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
    </AdminLayout>
  );
};

export default BlogCommentsPage;
