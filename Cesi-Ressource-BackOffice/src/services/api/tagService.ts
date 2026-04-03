import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import type { Tag, CreateTagDto, UpdateTagDto, TagQuery } from '../../types/tag.types';
import type { PaginatedResponse } from '../../types/common.types';

export const tagService = {
  getAll: (query?: TagQuery) =>
    apiClient.get<PaginatedResponse<Tag>>(ENDPOINTS.tags.base, query as Record<string, string | number | boolean | undefined>),

  getById: (id: string) =>
    apiClient.get<Tag>(ENDPOINTS.tags.byId(id)),

  create: (dto: CreateTagDto) =>
    apiClient.post<Tag>(ENDPOINTS.tags.base, dto),

  update: (id: string, dto: UpdateTagDto) =>
    apiClient.put<Tag>(ENDPOINTS.tags.byId(id), dto),

  delete: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.tags.byId(id)),
};
