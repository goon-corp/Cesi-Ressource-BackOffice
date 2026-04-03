import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiClient, setAccessToken, getAccessToken, registerUnauthorizedCallback } from '../services/api/apiClient';
import { API_BASE_URL, API_KEY, ENDPOINTS } from '../services/api/endpoints';
import type { LoginDto } from '../types/auth.types';
import type { LoginResponseDto } from '../types/auth.types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleUnauthorized = useCallback(() => {
    setAccessToken(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    registerUnauthorizedCallback(handleUnauthorized);
  }, [handleUnauthorized]);

  useEffect(() => {
    const existingToken = getAccessToken();
    if (existingToken) {
      setIsAuthenticated(true);
      setIsInitializing(false);
      return;
    }

    fetch(`${API_BASE_URL}${ENDPOINTS.auth.refreshToken}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.accessToken) {
          setAccessToken(data.accessToken);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setIsInitializing(false));
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const data = await apiClient.post<LoginResponseDto>(ENDPOINTS.auth.login('web'), dto);
    setAccessToken(data.accessToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post<void>(ENDPOINTS.auth.logout);
    } catch {}
    setAccessToken(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
