import { apiService } from './api';
import { Appointment, AppointmentCreate, AppointmentUpdate } from '../types';

export class AppointmentService {
  // Create new appointment
  async createAppointment(appointmentData: AppointmentCreate): Promise<Appointment> {
    const response = await apiService.post<Appointment>('/appointments/', appointmentData);
    return response;
  }

  // Get client's appointments
  async getClientAppointments(): Promise<Appointment[]> {
    const response = await apiService.get<Appointment[]>('/appointments/list/');
    return response;
  }

  // Get doctor's appointments
  async getDoctorAppointments(): Promise<Appointment[]> {
    const response = await apiService.get<Appointment[]>('/doctors/appointment/');
    return response;
  }

  // Get all appointments (Admin only)
  async getAllAppointments(): Promise<Appointment[]> {
    const response = await apiService.get<Appointment[]>('/admin/appointments/list/');
    return response;
  }

  // Update appointment (Client can update date/time, Admin can update status)
  async updateAppointment(id: number, appointmentData: AppointmentUpdate): Promise<Appointment> {
    const response = await apiService.patch<Appointment>(`/appointments/update/${id}/`, appointmentData);
    return response;
  }

  // Update appointment status (Admin/Doctor only)
  async updateAppointmentStatus(id: number, status: 'pending' | 'terminé' | 'confirmé'): Promise<Appointment> {
    const response = await apiService.patch<Appointment>(`/admin/appointments/update/${id}/`, { status });
    return response;
  }

  // Delete appointment
  async deleteAppointment(id: number): Promise<void> {
    await apiService.delete(`/appointments/${id}/delete/`);
  }

  // Get appointment by ID
  async getAppointmentById(id: number): Promise<Appointment> {
    const response = await apiService.get<Appointment>(`/appointments/${id}/`);
    return response;
  }
}

export const appointmentService = new AppointmentService();
