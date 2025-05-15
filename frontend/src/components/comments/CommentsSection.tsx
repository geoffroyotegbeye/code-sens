import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { Comment, commentApi } from '../../services/commentApi';
import { useAuth } from '../../context/AuthContext';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import toast from 'react-hot-toast';

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [visibleComments, setVisibleComments] = useState<number>(5);
  const [hasUserRepliedMap, setHasUserRepliedMap] = useState<Record<string, boolean>>({});

  // Charger les commentaires
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentApi.getCommentsByPostId(postId);
      
      // Trier les commentaires par date (les plus récents en premier)
      const sortedComments = [...data].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setComments(sortedComments);
      
      // Vérifier si l'utilisateur a répondu à des commentaires
      if (user) {
        const userRepliesMap: Record<string, boolean> = {};
        
        // Fonction récursive pour vérifier les réponses
        const checkUserReplies = (commentsList: Comment[]) => {
          for (const comment of commentsList) {
            // Vérifier si l'utilisateur est l'auteur de ce commentaire
            if (comment.author_id === user.id) {
              // Si c'est une réponse, marquer le parent comme ayant une réponse de l'utilisateur
              if (comment.parent_id) {
                userRepliesMap[comment.parent_id] = true;
              }
            }
            
            // Vérifier récursivement les réponses
            if (comment.replies && comment.replies.length > 0) {
              checkUserReplies(comment.replies);
            }
          }
        };
        
        checkUserReplies(sortedComments);
        setHasUserRepliedMap(userRepliesMap);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setError('Impossible de charger les commentaires. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, user]);

  // Ajouter un commentaire
  const handleAddComment = async (content: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    try {
      const newComment = await commentApi.createComment({
        content,
        author_id: user.id,
        author_name: user.full_name,
        post_id: postId,
        parent_id: replyingTo || undefined
      });

      // Si c'est une réponse à un commentaire existant
      if (replyingTo) {
        // Trouver le commentaire parent et ajouter la réponse
        const updatedComments = comments.map(comment => {
          if (comment._id === replyingTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyingTo(null);
      } else {
        // Sinon, ajouter le commentaire à la liste principale
        setComments([...comments, newComment]);
      }

      toast.success('Commentaire ajouté avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
      toast.error('Impossible d\'ajouter le commentaire. Veuillez réessayer.');
    }
  };

  // Modifier un commentaire
  const handleEditComment = async (content: string) => {
    if (!editingComment) return;

    try {
      const updatedComment = await commentApi.updateComment(editingComment._id, { content });

      // Mettre à jour le commentaire dans la liste
      const updatedComments = updateCommentInList(comments, updatedComment);
      setComments(updatedComments);
      setEditingComment(null);

      toast.success('Commentaire modifié avec succès');
    } catch (err) {
      console.error('Erreur lors de la modification du commentaire:', err);
      toast.error('Impossible de modifier le commentaire. Veuillez réessayer.');
    }
  };

  // Supprimer un commentaire
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await commentApi.deleteComment(commentId);

      // Supprimer le commentaire de la liste
      const updatedComments = removeCommentFromList(comments, commentId);
      setComments(updatedComments);

      toast.success('Commentaire supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression du commentaire:', err);
      toast.error('Impossible de supprimer le commentaire. Veuillez réessayer.');
    }
  };

  // Liker un commentaire
  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour aimer un commentaire');
      return;
    }

    try {
      const updatedComment = await commentApi.likeComment(commentId);

      // Mettre à jour le commentaire dans la liste
      const updatedComments = updateCommentInList(comments, updatedComment);
      setComments(updatedComments);
    } catch (err) {
      console.error('Erreur lors du like du commentaire:', err);
      toast.error('Impossible d\'aimer le commentaire. Veuillez réessayer.');
    }
  };

  // Fonction utilitaire pour mettre à jour un commentaire dans la liste
  const updateCommentInList = (commentsList: Comment[], updatedComment: Comment): Comment[] => {
    return commentsList.map(comment => {
      if (comment._id === updatedComment._id) {
        return updatedComment;
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInList(comment.replies, updatedComment)
        };
      }
      return comment;
    });
  };

  // Fonction utilitaire pour supprimer un commentaire de la liste
  const removeCommentFromList = (commentsList: Comment[], commentId: string): Comment[] => {
    return commentsList.filter(comment => {
      if (comment._id === commentId) {
        return false;
      }
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = removeCommentFromList(comment.replies, commentId);
      }
      return true;
    });
  };

  return (
    <div className="mt-12 bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <MessageCircle className="mr-2" />
        Commentaires ({comments.length})
      </h2>

      {/* Formulaire pour ajouter un commentaire principal */}
      {isAuthenticated ? (
        <CommentForm
          onSubmit={handleAddComment}
          placeholder="Partagez votre avis sur cet article..."
          submitLabel="Commenter"
        />
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
          <p className="text-blue-800">
            Connectez-vous pour laisser un commentaire
          </p>
        </div>
      )}

      {/* Affichage des commentaires */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchComments}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Réessayer
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </div>
      ) : (
        <div className="space-y-4">
          {/* Afficher seulement un nombre limité de commentaires */}
          {comments.slice(0, visibleComments).map(comment => (
            <React.Fragment key={comment._id}>
              {editingComment && editingComment._id === comment._id ? (
                <CommentForm
                  onSubmit={handleEditComment}
                  onCancel={() => setEditingComment(null)}
                  initialValue={editingComment.content}
                  submitLabel="Enregistrer"
                  isEditing={true}
                />
              ) : (
                <CommentItem
                  comment={comment}
                  onReply={setReplyingTo}
                  onEdit={setEditingComment}
                  onDelete={handleDeleteComment}
                  onLike={handleLikeComment}
                  hasUserReplied={hasUserRepliedMap[comment._id] || false}
                />
              )}
              
              {/* Formulaire de réponse */}
              {replyingTo === comment._id && (
                <CommentForm
                  onSubmit={handleAddComment}
                  onCancel={() => setReplyingTo(null)}
                  placeholder="Écrire une réponse..."
                  submitLabel="Répondre"
                  isReply={true}
                />
              )}
            </React.Fragment>
          ))}
          
          {/* Bouton "Voir plus" si nécessaire */}
          {comments.length > visibleComments && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleComments(prev => prev + 5)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 flex items-center mx-auto"
              >
                <ChevronDown size={16} className="mr-2" />
                Voir plus de commentaires
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
