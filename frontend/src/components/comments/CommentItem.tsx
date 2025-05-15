import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Reply, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Comment } from '../../services/commentApi';
import { useAuth } from '../../context/AuthContext';

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  level?: number;
  hasUserReplied?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  onLike,
  level = 0,
  hasUserReplied = false
}) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(hasUserReplied);
  const isAuthor = user && user.id === comment.author_id;
  const maxLevel = 3; // Limite de profondeur pour l'affichage des réponses imbriquées
  
  // Sauvegarder l'état d'affichage des réponses dans le localStorage
  useEffect(() => {
    if (user) {
      const key = `comment_${comment._id}_showReplies_${user.id}`;
      const savedState = localStorage.getItem(key);
      
      if (savedState !== null) {
        setShowReplies(savedState === 'true');
      }
    }
  }, [comment._id, user]);
  
  // Mettre à jour le localStorage lorsque l'état change
  const toggleReplies = () => {
    const newState = !showReplies;
    setShowReplies(newState);
    
    if (user) {
      const key = `comment_${comment._id}_showReplies_${user.id}`;
      localStorage.setItem(key, String(newState));
    }
  };

  // Formater la date relative (ex: "il y a 3 heures")
  const formattedDate = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: fr
  });

  return (
    <div className={`mb-4 ${level > 0 ? 'ml-6' : ''}`}>
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
              {comment.author_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{comment.author_name}</div>
              <div className="text-xs text-gray-500">{formattedDate}</div>
            </div>
          </div>
          {isAuthor && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(comment)}
                className="text-gray-500 hover:text-blue-600"
                title="Modifier"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="text-gray-500 hover:text-red-600"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="text-gray-800 mb-3">{comment.content}</div>
        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => onLike(comment._id)}
            className="flex items-center text-gray-500 hover:text-red-600"
          >
            <Heart size={16} className={`mr-1 ${comment.likes > 0 ? 'fill-red-600 text-red-600' : ''}`} />
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => onReply(comment._id)}
            className="flex items-center text-gray-500 hover:text-blue-600"
          >
            <Reply size={16} className="mr-1" />
            <span>Répondre</span>
          </button>
        </div>
      </div>

      {/* Afficher les réponses si elles existent et si le niveau n'est pas trop profond */}
      {comment.replies && comment.replies.length > 0 && level < maxLevel && (
        <div className="mt-2">
          <div className="flex items-center mb-2">
            <button
              onClick={toggleReplies}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              {showReplies ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  Masquer les réponses ({comment.replies.length})
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  Afficher les réponses ({comment.replies.length})
                </>
              )}
            </button>
          </div>
          {showReplies && (
            <div className="border-l-2 border-gray-200 pl-4">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onLike={onLike}
                  level={level + 1}
                  hasUserReplied={hasUserReplied}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
