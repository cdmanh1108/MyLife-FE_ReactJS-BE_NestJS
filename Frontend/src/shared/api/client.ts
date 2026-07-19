import axios, { type AxiosInstance } from 'axios';
import { storage } from '@/shared/lib/storage';

const BASE_URL = (globalThis as any).VITE_API_BASE_URL || 'http://localhost:3010/api/v1';
console.log('--- MyLife API Base URL loaded is:', BASE_URL);

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/* Attach access token and prevent duplicate /api/v1 prefix */
apiClient.interceptors.request.use((config) => {
  const token = storage.get<string>('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Prevent duplicate /api/v1 prefix from Orval generated endpoints
  if (config.url && config.url.startsWith('/api/v1')) {
    config.url = config.url.substring(7); // Remove '/api/v1' prefix
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

function transformMongooseIds(data: any): any {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map(transformMongooseIds);
  }

  if (typeof data === 'object') {
    if (data instanceof Date) return data;

    const clone: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        clone[key] = transformMongooseIds(data[key]);
      }
    }

    if (clone._id && !clone.id) {
      clone.id = typeof clone._id === 'object' && clone._id.toString ? clone._id.toString() : clone._id;
    }

    return clone;
  }

  return data;
}

/* Handle response wrapper, errors, and 401 token refresh flow */
apiClient.interceptors.response.use(
  (response) => {
    // If it's a success response from the backend (which always wraps in success: true/false)
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success) {
        // Return the inner data transformed
        return transformMongooseIds(response.data.data);
      } else {
        // Structured error response
        return Promise.reject(response.data.error);
      }
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check if the status is 401 and we have not retried yet and not already on the refresh endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = storage.get<string>('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        if (!refreshPromise) {
          refreshPromise = axios
            .post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
              `${BASE_URL}/auth/refresh`,
              { refreshToken }
            )
            .then((r) => {
              if (r.data.success) {
                const { accessToken, refreshToken: newRefreshToken } = r.data.data;
                storage.set('accessToken', accessToken);
                storage.set('refreshToken', newRefreshToken);
                return accessToken;
              }
              return null;
            })
            .catch(() => null)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (e) {
        // Clear tokens and notify the auth store
        storage.remove('accessToken');
        storage.remove('refreshToken');
        window.dispatchEvent(new Event('auth:logout'));
      }
    }

    // Attempt to extract structured backend error
    if (error.response?.data && typeof error.response.data === 'object') {
      const responseData = error.response.data as any;
      if (responseData.error) {
        return Promise.reject(responseData.error);
      }
    }

    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error',
      details: {},
      traceId: '',
    });
  }
);

