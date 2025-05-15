import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { likeApi } from '../../services/likeApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface LikeButtonProps {
  postId: string;
  initialLikesCount?: number;
  initialLikedByUser?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikesCount = 0,
  initialLikedByUser = false
}) => {
  const { isAuthenticated } = useAuth();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialLikedByUser);
  const [loading, setLoading] = useState(false);

  // Charger l'état initial des likes
  useEffect(() => {
    const fetchLikesInfo = async () => {
      try {
        const data = await likeApi.getPostLikesInfo(postId);
        setLikesCount(data.likes_count);
        setLiked(data.liked_by_user);
      } catch (error) {
        console.error('Erreur lors du chargement des likes:', error);
      }
    };

    fetchLikesInfo();
  }, [postId]);

  // Gérer le clic sur le bouton like
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour aimer cet article');
      return;
    }

    try {
      setLoading(true);
      const response = await likeApi.togglePostLike(postId);
      setLikesCount(response.likes_count);
      setLiked(response.liked_by_user);
      
      if (response.liked_by_user) {
        toast.success('Article ajouté à vos favoris');
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart
        size={20}
        className={liked ? 'fill-red-600' : ''}
      />
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
