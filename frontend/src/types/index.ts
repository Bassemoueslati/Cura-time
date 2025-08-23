// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_role: 'admin' | 'client' | 'doctor';
  adresse: string;
  gender: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  adresse: string;
  gender: string;
  user_role: 'client' | 'admin';
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_id: number;
  user_role: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  adresse: string;
  date_joined: string;
  refresh: string;
  access: string;
}

// Doctor types
export interface Specialty {
  id: number;
  name: string;
  description: string;
}

export interface Doctor {
  id: number;
  user?: User;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  specialization: Specialty;
  availability: Record<string, string[]>; // Date -> time slots
  bio: string;
  photo?: string;
  consultation_fee?: number;
}

// Appointment types
export interface Appointment {
  id: number;
  client: User;
  doctor: Doctor;
  date_time: string;
  status: 'pending' | 'terminé' | 'confirmé';
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreate {
  doctor: number;
  date_time: string;
}

export interface AppointmentUpdate {
  date_time?: string;
  status?: 'pending' | 'terminé' | 'confirmé';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: UserLogin) => Promise<void>;
  loginAdmin: (credentials: UserLogin) => Promise<void>;
  loginDoctor: (credentials: UserLogin) => Promise<void>;
  loginClient: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Form types
export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  email: string;
  code: string;
  new_password: string;
}

export interface ProfileUpdateForm {
  first_name: string;
  last_name: string;
  email: string;
  adresse: string;
  gender: string;
}
