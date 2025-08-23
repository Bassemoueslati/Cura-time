import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { toast } from 'react-toastify';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsData = await appointmentService.getDoctorAppointments();
        setAppointments(appointmentsData);
      } catch (err: any) {
        setError('Erreur lors du chargement des rendez-vous');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId: number, newStatus: 'pending' | 'terminé' | 'confirmé') => {
    try {
      setUpdatingStatus(appointmentId);
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);

      // Update local state
      setAppointments(appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));

      toast.success('Statut mis à jour avec succès');
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmé':
        return '#059669';
      case 'pending':
        return '#d97706';
      case 'terminé':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmé':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'terminé':
        return 'Terminé';
      default:
        return status;
    }
  };

  const isUpcoming = (dateTimeString: string) => {
    return new Date(dateTimeString) > new Date();
  };

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date_time);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments
    .filter(apt => isUpcoming(apt.date_time))
    .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          Bonjour, Dr. {user?.first_name} ! 👨‍⚕️
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          Bienvenue sur votre espace professionnel CuraTime
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              📅
            </div>
            <span style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#2563eb'
            }}>
              {todayAppointments.length}
            </span>
          </div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            Aujourd'hui
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Consultations du jour
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ⏳
            </div>
            <span style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#d97706'
            }}>
              {pendingAppointments.length}
            </span>
          </div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            En attente
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            À confirmer
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dcfce7',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              📋
            </div>
            <span style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#059669'
            }}>
              {upcomingAppointments.length}
            </span>
          </div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            À venir
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Prochaines consultations
          </p>
        </div>
      </div>

      {/* Today's Appointments */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827'
          }}>
            Consultations d'aujourd'hui
          </h2>
          <Link
            to="/doctor/appointments"
            style={{
              color: '#2563eb',
              fontSize: '0.875rem',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Voir tout →
          </Link>
        </div>

        {todayAppointments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {todayAppointments.map((appointment) => {
              const { date, time } = formatDateTime(appointment.date_time);
              return (
                <div key={appointment.id} style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#2563eb'
                          }}>
                            {appointment.client.first_name.charAt(0)}{appointment.client.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '0.25rem'
                          }}>
                            {appointment.client.first_name} {appointment.client.last_name}
                          </h3>
                          <p style={{
                            color: '#6b7280',
                            fontSize: '0.875rem'
                          }}>
                            📧 {appointment.client.email}
                          </p>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '2rem',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <span style={{
                            fontSize: '0.875rem',
                            color: '#6b7280'
                          }}>
                            🕐 Heure
                          </span>
                          <p style={{
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {time}
                          </p>
                        </div>
                      </div>

                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        backgroundColor: getStatusColor(appointment.status) + '20',
                        color: getStatusColor(appointment.status)
                      }}>
                        {getStatusText(appointment.status)}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmé')}
                            disabled={updatingStatus === appointment.id}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              border: 'none',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: updatingStatus === appointment.id ? 'not-allowed' : 'pointer',
                              opacity: updatingStatus === appointment.id ? 0.5 : 1
                            }}
                          >
                            {updatingStatus === appointment.id ? 'Confirmation...' : '✅ Confirmer'}
                          </button>
                        </>
                      )}

                      {appointment.status === 'confirmé' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'terminé')}
                          disabled={updatingStatus === appointment.id}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: updatingStatus === appointment.id ? 'not-allowed' : 'pointer',
                            opacity: updatingStatus === appointment.id ? 0.5 : 1
                          }}
                        >
                          {updatingStatus === appointment.id ? 'Finalisation...' : '✅ Terminer'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Aucune consultation aujourd'hui
            </h3>
            <p style={{ color: '#6b7280' }}>
              Profitez de cette journée plus calme !
            </p>
          </div>
        )}
      </div>

      {error && (
        <ErrorMessage message={error} />
      )}
    </div>
  );
};

export default DoctorDashboard;
