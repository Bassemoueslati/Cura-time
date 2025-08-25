import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (we'll create these next)
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import DoctorLoginPage from './pages/Auth/DoctorLoginPage';
import AdminLoginPage from './pages/Auth/AdminLoginPage';
import SupportPage from './pages/SupportPage';

// Client pages
import ClientDashboard from './pages/Client/Dashboard';
import DoctorsPage from './pages/Client/DoctorsPage';
import DoctorDetailPage from './pages/Client/DoctorDetailPage';
import DoctorProfilePage from './pages/Doctor/DoctorProfilePage';

// Client pages (continued)
import AppointmentsPage from './pages/Client/AppointmentsPage';
import ProfilePage from './pages/Client/ProfilePage';

// Doctor pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointmentsPage from './pages/Doctor/AppointmentsPage';
import DoctorAvailabilityPage from './pages/Doctor/DoctorAvailabilityPage';

// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminDoctorsPage from './pages/Admin/DoctorsPage';
import AdminSpecialtiesPage from './pages/Admin/SpecialtiesPage';
import AdminStatisticsPage from './pages/Admin/StatisticsPage';
import AdminAppointmentsPage from './pages/Admin/AppointmentsPage';
import AdminLayout from './components/Layout/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
            <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
            <Route path="/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />
            <Route path="/doctor/login" element={<Layout><DoctorLoginPage /></Layout>} />
            <Route path="/admin/login" element={<Layout><AdminLoginPage /></Layout>} />
            <Route path="/doctors" element={<Layout><DoctorsPage /></Layout>} />
            <Route path="/doctors/:id" element={<Layout><DoctorDetailPage /></Layout>} />
            <Route path="/support" element={<Layout><SupportPage /></Layout>} />

            {/* Client protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="client">
                <Layout><ClientDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute requiredRole="client">
                <Layout><AppointmentsPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requiredRole="client">
                <Layout><ProfilePage /></Layout>
              </ProtectedRoute>
            } />

            {/* Doctor protected routes */}
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute requiredRole="doctor" redirectTo="/doctor/login">
                <Layout><DoctorDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/doctor/appointments" element={
              <ProtectedRoute requiredRole="doctor" redirectTo="/doctor/login">
                <Layout><DoctorAppointmentsPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/doctor/profile" element={
              <ProtectedRoute requiredRole="doctor" redirectTo="/doctor/login">
                <Layout><DoctorProfilePage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/doctor/availability" element={
              <ProtectedRoute requiredRole="doctor" redirectTo="/doctor/login">
                <Layout><DoctorAvailabilityPage /></Layout>
              </ProtectedRoute>
            } />

            {/* Admin protected routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/doctors" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminDoctorsPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/specialties" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminSpecialtiesPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/statistics" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminStatisticsPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/appointments" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminAppointmentsPage /></AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
