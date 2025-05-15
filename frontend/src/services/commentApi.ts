import { fetchApi } from './api';

export interface Comment {
  _id: string;
  content: string;
  author_id: string;
  author_name: string;
  post_id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  likes: number;
  replies?: Comment[];
}

export interface CommentCreateData {
  content: string;
  author_id: string;
  author_name: string;
  post_id: string;
  parent_id?: string;
}

export interface CommentUpdateData {
  content: string;
}

export const commentApi = {
  // Récupérer tous les commentaires d'un article
  getCommentsByPostId(postId: string): Promise<Comment[]> {
    return fetchApi<Comment[]>(`/comments/post/${postId}`);
  },

  // Récupérer un commentaire par son ID
  getCommentById(commentId: string): Promise<Comment> {
    return fetchApi<Comment>(`/comments/${commentId}`);
  },

  // Créer un nouveau commentaire
  createComment(data: CommentCreateData): Promise<Comment> {
    return fetchApi<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Mettre à jour un commentaire
  updateComment(commentId: string, data: CommentUpdateData): Promise<Comment> {
    return fetchApi<Comment>(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Supprimer un commentaire
  deleteComment(commentId: string): Promise<{ message: string }> {
    return fetchApi<{ message: string }>(`/comments/${commentId}`, {
      method: 'DELETE'
    });
  },

  // Liker un commentaire
  likeComment(commentId: string): Promise<Comment> {
    return fetchApi<Comment>(`/comments/${commentId}/like`, {
      method: 'POST'
    });
  }
};
