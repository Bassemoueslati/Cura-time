from django.urls import path
from .views import (
    # Auth
    RegisterView,
    ClientLoginView,
    AdminLoginView,

    # Doctor (Client & Admin)
    DoctorListView,
    DoctorDetailView,
    DoctorCreateView,
    DoctorUpdateDeleteView,

    # Appointment (Client & Admin)
    AppointmentCreateView,
    ClientAppointmentListView,
    AppointmentDeleteView,
    ClientAppointmentUpdateView,
    AdminAppointmentStatusUpdateView,
    AdminAppointmentListView,
    SpecialtyListCreateView,
    SpecialtyRetrieveUpdateDestroyView,
    DoctorsBySpecialtyView,
    ForgotPasswordAPIView,
    VerifyCodeAPIView,
    DoctorAppointmentListView,
    DoctorLoginView,
    UserUpdateView,

    # Admin Dashboard
    AdminDashboardStatsView,
    AdminDashboardActivitiesView,

    # Admin Management
    AdminDoctorsListView,
    AdminDoctorToggleStatusView,
    AdminSpecialtiesListView,
    AdminSpecialtyDetailView,
    AdminDoctorsCountView,
    AdminSpecialtiesForFormsView,

    # Doctor Dashboard
    DoctorDashboardStatsView,
    DoctorRecentAppointmentsView,

    # Support & Doctor self endpoints
    SupportContactView,
    DoctorMeView,
)

urlpatterns = [
    # 🧾 Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('client/login/', ClientLoginView.as_view(), name='client-login'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('client/forgot-password/', ForgotPasswordAPIView.as_view(), name='forgot-password'),
    path('client/verify-code/', VerifyCodeAPIView.as_view(), name='verify-code'),
    path('client/update-profile/', UserUpdateView.as_view(), name='update-profile'),  

    # 👨‍⚕️ Doctor APIs
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),                         # Client: list doctors
    path('doctors/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),            # Client: doctor details

    path('admin/doctors/<int:pk>/', DoctorUpdateDeleteView.as_view(), name='doctor-update-delete'),  # Admin: update/delete doctor

    # 📅 Appointment APIs
    path('appointments/', AppointmentCreateView.as_view(), name='appointment-create'),      # Client: create appointment
    path('appointments/list/', ClientAppointmentListView.as_view(), name='appointment-list'),     # Client: list own appointments
    path('appointments/update/<int:pk>/', ClientAppointmentUpdateView.as_view(), name='client-appointment-update'),  # Client: update appointment
    path('appointments/<int:pk>/delete/', AppointmentDeleteView.as_view(), name='appointment-delete'),


    path('admin/appointments/update/<int:pk>/', AdminAppointmentStatusUpdateView.as_view(), name='appointment-update'),  # Admin/Client: update
    path('admin/appointments/list/', AdminAppointmentListView.as_view(), name='appointment-list-admin'),   # Admin: list all

    # Public specialties list (patients & guests)
    path('specialties/', SpecialtyListCreateView.as_view(), name='specialties-list'),

    path('doctors/by-specialty/<int:specialty_id>/', DoctorsBySpecialtyView.as_view(), name='doctors-by-speciality'),
    path('doctors/appointment/' , DoctorAppointmentListView.as_view(), name='doctor-appointment-list'),
    path('doctors/login/', DoctorLoginView.as_view(), name='doctor-login'),

    # Admin Dashboard
    path('admin/dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('admin/dashboard/activities/', AdminDashboardActivitiesView.as_view(), name='admin-dashboard-activities'),

    # Admin Management
    path('admin/doctors/', AdminDoctorsListView.as_view(), name='admin-doctors-list'),
    path('admin/doctors/<int:doctor_id>/', AdminDoctorsListView.as_view(), name='admin-doctors-detail'),
    path('admin/doctors/<int:doctor_id>/toggle-status/', AdminDoctorToggleStatusView.as_view(), name='admin-doctor-toggle-status'),
    path('admin/doctors/count/', AdminDoctorsCountView.as_view(), name='admin-doctors-count'),  # Debug endpoint
    path('admin/specialties/', AdminSpecialtiesListView.as_view(), name='admin-specialties-list'),
    path('admin/specialties/<int:specialty_id>/', AdminSpecialtyDetailView.as_view(), name='admin-specialty-detail'),  # DELETE only
    path('admin/specialties/<int:pk>/', SpecialtyRetrieveUpdateDestroyView.as_view(), name='admin-specialty-update'),  # PUT/PATCH/GET by DRF generic

    # Doctor Dashboard
    path('doctors/dashboard/stats/', DoctorDashboardStatsView.as_view(), name='doctor-dashboard-stats'),
    path('doctors/appointments/recent/', DoctorRecentAppointmentsView.as_view(), name='doctor-recent-appointments'),

    # Support & Doctor self endpoints
    path('support/contact/', SupportContactView.as_view(), name='support-contact'),
    path('doctors/me/', DoctorMeView.as_view(), name='doctor-me'),
]