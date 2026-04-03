export const API_BASE_URL = import.meta.env.VITE_BASE_URL_API ?? 'http://localhost:5000';
export const API_KEY = import.meta.env.VITE_API_KEY ?? '';

export const ENDPOINTS = {
  auth: {
    login: (client: string) => `/api/auth/login/${client}`,
    logout: '/api/auth/logout',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    refreshToken: '/api/auth/refresh-token',
    changePassword: '/api/auth/change-password',
    confirmAccount: (token: string) => `/api/auth/confirm-account/${token}`,
  },
  users: {
    base: '/api/user',
    byId: (id: string) => `/api/user/${id}`,
    profile: (id: string) => `/api/user/profile/${id}`,
  },
  ressources: {
    base: '/api/ressources',
    byId: (id: string) => `/api/ressources/${id}`,
  },
  tags: {
    base: '/api/tags',
    byId: (id: string) => `/api/tags/${id}`,
  },
  reports: {
    base: '/api/reports',
    byId: (id: string) => `/api/reports/${id}`,
  },
  comments: {
    base: '/api/comments',
    byId: (id: string) => `/api/comments/${id}`,
  },
} as const;
