import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import type { Comment, UpdateCommentDto } from '../../types/comment.types';

export const commentService = {
  getAll: () =>
    apiClient.get<Comment[]>(ENDPOINTS.comments.base),

  getById: (id: string) =>
    apiClient.get<Comment>(ENDPOINTS.comments.byId(id)),

  update: (id: string, dto: UpdateCommentDto) =>
    apiClient.put<Comment>(ENDPOINTS.comments.byId(id), dto),

  delete: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.comments.byId(id)),
};
