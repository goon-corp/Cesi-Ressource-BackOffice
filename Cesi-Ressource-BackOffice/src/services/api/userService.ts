import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import type { User, UpdateUserDto } from '../../types/user.types';

export const userService = {
  getAll: () =>
    apiClient.get<User[]>(ENDPOINTS.users.base),

  getById: (id: string) =>
    apiClient.get<User>(ENDPOINTS.users.byId(id)),

  update: (id: string, dto: UpdateUserDto) =>
    apiClient.put<User>(ENDPOINTS.users.byId(id), dto),

  toggleActive: (id: string, isActive: boolean) =>
    apiClient.put<User>(ENDPOINTS.users.byId(id), { isActive }),

  delete: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.users.byId(id)),
};
