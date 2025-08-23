import { apiService } from './api';
import { Doctor, Specialty } from '../types';

export class DoctorService {
  // Get all doctors
  async getAllDoctors(): Promise<Doctor[]> {
    const response = await apiService.get<Doctor[]>('/doctors/');
    return response;
  }

  // Get doctor by ID
  async getDoctorById(id: number): Promise<Doctor> {
    const response = await apiService.get<Doctor>(`/doctors/${id}/`);
    return response;
  }

  // Get doctors by specialty
  async getDoctorsBySpecialty(specialtyId: number): Promise<Doctor[]> {
    const response = await apiService.get<Doctor[]>(`/doctors/by-specialty/${specialtyId}/`);
    return response;
  }

  // Doctor self profile
  async getMe(): Promise<{ user: any, doctor: any }> {
    return await apiService.get('/doctors/me/');
  }

  async updateMe(data: any): Promise<{ message: string, user: any, doctor: any }> {
    return await apiService.patch('/doctors/me/', data);
  }

  // Create new doctor (Admin only)
  async createDoctor(doctorData: Omit<Doctor, 'id'>): Promise<Doctor> {
    const response = await apiService.post<Doctor>('/admin/doctors/', doctorData);
    return response;
  }

  // Update doctor (Admin only)
  async updateDoctor(id: number, doctorData: Partial<Doctor>): Promise<Doctor> {
    const response = await apiService.put<Doctor>(`/admin/doctors/${id}/`, doctorData);
    return response;
  }

  // Delete doctor (Admin only)
  async deleteDoctor(id: number): Promise<void> {
    await apiService.delete(`/admin/doctors/${id}/`);
  }

  // Get all specialties
  async getAllSpecialties(): Promise<Specialty[]> {
    // Public list for patients and guests
    const response = await apiService.get<Specialty[]>('/specialties/');
    return response;
  }

  // Create specialty (Admin only)
  async createSpecialty(specialtyData: Omit<Specialty, 'id'>): Promise<Specialty> {
    const response = await apiService.post<Specialty>('/admin/specialties/', specialtyData);
    return response;
  }

  // Update specialty (Admin only)
  async updateSpecialty(id: number, specialtyData: Partial<Specialty>): Promise<Specialty> {
    const response = await apiService.put<Specialty>(`/admin/specialties/${id}/`, specialtyData);
    return response;
  }

  // Delete specialty (Admin only)
  async deleteSpecialty(id: number): Promise<void> {
    await apiService.delete(`/admin/specialties/${id}/`);
  }
}

export const doctorService = new DoctorService();
