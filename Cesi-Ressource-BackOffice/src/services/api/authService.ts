import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import type { ForgotPasswordDto } from '../../types/auth.types';

export const authService = {
  forgotPassword: (dto: ForgotPasswordDto) =>
    apiClient.post<void>(ENDPOINTS.auth.forgotPassword, dto),
};
