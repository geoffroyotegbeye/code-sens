import { fetchApi } from './api';

export interface LikeResponse {
  likes_count: number;
  liked_by_user: boolean;
}

export const likeApi = {
  // Ajouter ou retirer un like à un article
  togglePostLike(postId: string): Promise<LikeResponse> {
    return fetchApi<LikeResponse>(`/likes/post/${postId}`, {
      method: 'POST'
    });
  },

  // Récupérer le nombre de likes d'un article et si l'utilisateur l'a liké
  getPostLikesInfo(postId: string): Promise<LikeResponse> {
    return fetchApi<LikeResponse>(`/likes/post/${postId}/count`);
  }
};
