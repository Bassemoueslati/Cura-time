import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        // Try multiple token storage keys for compatibility
        // Prefer modern key first to avoid using a stale legacy token
        const token = localStorage.getItem('authToken') ||
                      localStorage.getItem('token') ||
                      localStorage.getItem('access_token');
        if (token) {
          if (!config.headers) config.headers = {} as any;
          (config.headers as any).Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Do NOT auto-logout on public pages. Only redirect if user is in protected areas.
          const currentPath = window.location.pathname;
          const isProtected = currentPath.startsWith('/admin') || currentPath.startsWith('/doctor') || currentPath.startsWith('/dashboard') || currentPath.startsWith('/appointments') || currentPath.startsWith('/profile');
          if (isProtected) {
            // Keep tokens to avoid wiping session unexpectedly; just redirect to the proper login
            if (currentPath.startsWith('/admin')) {
              window.location.href = '/admin/login';
            } else if (currentPath.startsWith('/doctor')) {
              window.location.href = '/doctor/login';
            } else {
              window.location.href = '/login';
            }
          }
        }
        
        // Show error message, but avoid duplicate noise on 401 public fetches
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           (error.response?.status === 401 ? undefined : 'Une erreur est survenue');
        if (errorMessage) toast.error(errorMessage);
        
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string): Promise<T> {
    const response = await this.api.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }

  // File upload method
  async uploadFile<T>(url: string, formData: FormData): Promise<T> {
    const response = await this.api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
