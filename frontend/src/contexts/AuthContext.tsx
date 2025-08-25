import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserLogin, UserRegistration, AuthContextType } from '../types';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser({
          id: storedUser.user_id,
          email: storedUser.email,
          first_name: storedUser.first_name,
          last_name: storedUser.last_name,
          user_role: storedUser.user_role as 'admin' | 'client' | 'doctor',
          adresse: storedUser.adresse,
          gender: '',
          is_active: storedUser.is_active,
          is_staff: storedUser.is_staff,
          date_joined: storedUser.date_joined,
        });
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: UserLogin): Promise<void> => {
    try {
      setIsLoading(true);

      // Try client login first
      let response;
      try {
        response = await authService.loginClient(credentials);
      } catch (clientError: any) {
        // If client login fails, try doctor login
        try {
          response = await authService.loginDoctor(credentials);
        } catch (doctorError: any) {
          // If doctor account is disabled (403), show clear message and stop
          const status = doctorError?.response?.status;
          const backendMsg = doctorError?.response?.data?.error || doctorError?.response?.data?.detail;
          if (status === 403) {
            toast.error(backendMsg || 'Votre compte médecin est désactivé. Veuillez contacter l’administrateur.');
            // Mark a flag so UI can react if needed
            localStorage.setItem('doctor_login_blocked', '1');
            throw doctorError;
          }
          // Otherwise, try admin login
          const adminResponse = await authService.loginAdmin(credentials);
          setToken(adminResponse.access);
          setUser({
            id: 0, // Admin doesn't have user_id in response
            email: credentials.email,
            first_name: 'Admin',
            last_name: '',
            user_role: 'admin',
            adresse: '',
            gender: '',
            is_active: true,
            is_staff: true,
            date_joined: new Date().toISOString(),
          });
          toast.success('Connexion réussie !');
          return;
        }
      }

      setToken(response.access);
      setUser({
        id: response.user_id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        user_role: response.user_role as 'admin' | 'client' | 'doctor',
        adresse: response.adresse,
        gender: '',
        is_active: response.is_active,
        is_staff: response.is_staff,
        date_joined: response.date_joined,
      });

      toast.success('Connexion réussie !');
    } catch (error: any) {
      const status = error?.response?.status;
      const backendMsg = error?.response?.data?.error || error?.response?.data?.detail;
      if (status === 403) {
        toast.error(backendMsg || 'Votre compte médecin est désactivé. Veuillez contacter l’administrateur.');
      } else {
        toast.error(backendMsg || 'Identifiants incorrects');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (credentials: UserLogin): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.loginAdmin(credentials);
      setToken(response.access);
      setUser({
        id: response.user_id || 0,
        email: response.email,
        first_name: response.first_name || 'Admin',
        last_name: response.last_name || '',
        user_role: 'admin',
        adresse: response.adresse || '',
        gender: '',
        is_active: response.is_active || true,
        is_staff: response.is_staff || true,
        date_joined: response.date_joined || new Date().toISOString(),
      });
      toast.success('Connexion administrateur réussie !');
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast.error(error.response?.data?.detail || 'Erreur de connexion administrateur');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDoctor = async (credentials: UserLogin): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.loginDoctor(credentials);
      setToken(response.access);
      setUser({
        id: response.user_id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        user_role: 'doctor',
        adresse: response.adresse,
        gender: '',
        is_active: response.is_active,
        is_staff: response.is_staff,
        date_joined: response.date_joined,
      });
      toast.success('Connexion médecin réussie !');
    } catch (error: any) {
      console.error('Doctor login error:', error);
      const status = error?.response?.status;
      const backendMsg = error?.response?.data?.error || error?.response?.data?.detail;
      if (status === 403) {
        toast.error("Tu n'as pas l'accès: votre compte médecin est désactivé par l'admin.");
      } else if (backendMsg) {
        toast.error(backendMsg);
      } else {
        toast.error('Erreur de connexion médecin');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginClient = async (credentials: UserLogin): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.loginClient(credentials);
      setToken(response.access);
      setUser({
        id: response.user_id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        user_role: 'client',
        adresse: response.adresse,
        gender: '',
        is_active: response.is_active,
        is_staff: response.is_staff,
        date_joined: response.date_joined,
      });
      toast.success('Connexion client réussie !');
    } catch (error: any) {
      console.error('Client login error:', error);
      toast.error(error.response?.data?.detail || 'Erreur de connexion client');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserRegistration): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.register(userData);
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.email?.[0] || 
                          error.response?.data?.message || 
                          'Erreur lors de l\'inscription';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(userData);
      // Merge non-empty fields into current user to avoid blank page due to missing keys
      setUser((prev) => {
        if (!prev) return updatedUser;
        return {
          ...prev,
          ...Object.fromEntries(Object.entries(updatedUser as any).filter(([_, v]) => v !== undefined && v !== null)),
        } as User;
      });
      toast.success('Profil mis à jour avec succès !');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Nettoyer complètement le localStorage
    authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('loginResponse');

    // Réinitialiser l'état
    setUser(null);
    setToken(null);

    toast.info('Vous avez été déconnecté');

    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      window.location.href = '/';
    }, 600);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    loginAdmin,
    loginDoctor,
    loginClient,
    register,
    logout,
    isLoading,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
