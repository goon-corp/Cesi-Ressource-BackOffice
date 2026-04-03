import { API_BASE_URL, API_KEY, ENDPOINTS } from './endpoints';

let accessToken: string | null = sessionStorage.getItem('accessToken');
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (token) {
    sessionStorage.setItem('accessToken', token);
  } else {
    sessionStorage.removeItem('accessToken');
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

function notifyRefreshQueue(token: string | null): void {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.auth.refreshToken}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
      },
    });

    if (!response.ok) {
      setAccessToken(null);
      notifyRefreshQueue(null);
      return null;
    }

    const data = await response.json();
    const newToken: string = data.accessToken;
    setAccessToken(newToken);
    notifyRefreshQueue(newToken);
    return newToken;
  } catch {
    setAccessToken(null);
    notifyRefreshQueue(null);
    return null;
  } finally {
    isRefreshing = false;
  }
}

type OnUnauthorized = () => void;
let unauthorizedCallback: OnUnauthorized | null = null;

export function registerUnauthorizedCallback(cb: OnUnauthorized): void {
  unauthorizedCallback = cb;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
console.log(API_KEY)
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      unauthorizedCallback?.();
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    const retryResponse = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      },
      credentials: 'include',
    });

    if (!retryResponse.ok) {
      throw new Error(await retryResponse.text());
    }

    if (retryResponse.status === 204) {
      return undefined as T;
    }

    return retryResponse.json();
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined>) => {
    const url = params
      ? `${path}?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString()}`
      : path;
    return request<T>(url, { method: 'GET' });
  },

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
