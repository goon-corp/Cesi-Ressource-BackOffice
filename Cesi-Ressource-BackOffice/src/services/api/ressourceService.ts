import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import type { Ressource, RessourceQuery } from '../../types/ressource.types';
import type { PaginatedResponse } from '../../types/common.types';

export const ressourceService = {
  getAll: (query?: RessourceQuery) =>
    apiClient.get<PaginatedResponse<Ressource>>(ENDPOINTS.ressources.base, query as Record<string, string | number | boolean | undefined>),

  delete: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.ressources.byId(id)),
};
