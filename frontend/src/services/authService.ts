import { apiService } from './api';
import { 
  UserLogin, 
  UserRegistration, 
  LoginResponse, 
  User,
  ForgotPasswordForm,
  ResetPasswordForm 
} from '../types';

export class AuthService {
  // Client login
  async loginClient(credentials: UserLogin): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/client/login/', credentials);
    
    // Store tokens and user data (new + legacy keys for compatibility)
    localStorage.setItem('authToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    localStorage.setItem('loginResponse', JSON.stringify(response));
    // Legacy keys used in some pages
    localStorage.setItem('token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user', JSON.stringify(response));
    localStorage.setItem('userType', (response as any).user_role || 'client');
    
    return response;
  }

  // Doctor login
  async doctorLogin(credentials: UserLogin): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/doctors/login/', credentials);

    // Store tokens and user data (new + legacy keys for compatibility)
    localStorage.setItem('authToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    localStorage.setItem('loginResponse', JSON.stringify(response));
    // Legacy keys used in some pages
    localStorage.setItem('token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user', JSON.stringify(response));
    localStorage.setItem('userType', (response as any).user_role || 'doctor');

    return response;
  }

  // Legacy method for compatibility
  async loginDoctor(credentials: UserLogin): Promise<LoginResponse> {
    return this.doctorLogin(credentials);
  }

  // Admin login
  async loginAdmin(credentials: UserLogin): Promise<any> {
    const response = await apiService.post<any>('/admin/login/', credentials);

    // Store tokens with correct keys (new + legacy for compatibility)
    localStorage.setItem('authToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);

    // Store user info with correct key
    localStorage.setItem('loginResponse', JSON.stringify(response));

    // Legacy keys used in some pages
    localStorage.setItem('token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user', JSON.stringify(response));
    localStorage.setItem('userType', (response as any).user_role || 'admin');

    return response;
  }

  // Register new user
  async register(userData: UserRegistration): Promise<User> {
    const response = await apiService.post<User>('/register/', userData);
    return response;
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordForm): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/client/forgot-password/', data);
    return response;
  }

  // Verify code and reset password
  async resetPassword(data: ResetPasswordForm): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/client/verify-code/', data);
    return response;
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiService.put<User>('/client/update-profile/', userData);
    return response;
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('loginResponse');
  }

  // Get current user from localStorage
  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem('loginResponse');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check user role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.user_role === role;
  }
}

export const authService = new AuthService();
