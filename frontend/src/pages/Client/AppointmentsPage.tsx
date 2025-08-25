import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { toast } from 'react-toastify';

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsData = await appointmentService.getClientAppointments();
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

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      await appointmentService.deleteAppointment(appointmentId);
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
      toast.success('Rendez-vous annulé avec succès');
    } catch (err: any) {
      toast.error('Erreur lors de l\'annulation du rendez-vous');
      console.error('Error cancelling appointment:', err);
    } finally {
      setCancellingId(null);
    }
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

  const isUpcoming = (dateTimeString: string) => {
    return new Date(dateTimeString) > new Date();
  };

  const sortedAppointments = appointments.sort((a, b) =>
    new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
  );

  const upcomingAppointments = sortedAppointments.filter(apt => isUpcoming(apt.date_time));
  const pastAppointments = sortedAppointments.filter(apt => !isUpcoming(apt.date_time));

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Mes Rendez-vous
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Gérez vos consultations médicales
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = '/dashboard')}
          style={{
            padding: '.6rem .9rem',
            border: '1px solid #e5e7eb',
            borderRadius: '.5rem',
            background: 'white',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onMouseOver={(e)=> (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'}
          onMouseOut={(e)=> (e.currentTarget as HTMLButtonElement).style.background = 'white'}
        >
          ← Retour
        </button>
      </div>

      {appointments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Aucun rendez-vous
          </h3>
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem'
          }}>
            Vous n'avez pas encore de rendez-vous programmé
          </p>
          <Link
            to="/doctors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Prendre un rendez-vous
            <span style={{ marginLeft: '0.5rem' }}>→</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Rendez-vous à venir ({upcomingAppointments.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingAppointments.map((appointment) => {
                  const { date, time } = formatDateTime(appointment.date_time);
                  return (
                    <div key={appointment.id} style={{
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      padding: '1.5rem',
                      border: '1px solid #e5e7eb'
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
                              width: '60px',
                              height: '60px',
                              backgroundColor: '#dbeafe',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#2563eb'
                              }}>
                                {appointment.doctor?.first_name?.charAt(0) || 'D'}{appointment.doctor?.last_name?.charAt(0) || 'R'}
                              </span>
                            </div>
                            <div>
                              <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: '#111827',
                                marginBottom: '0.25rem'
                              }}>
                                Dr. {appointment.doctor?.first_name || 'Médecin'} {appointment.doctor?.last_name || 'Inconnu'}
                              </h3>
                              <p style={{
                                color: '#2563eb',
                                fontWeight: '500'
                              }}>
                                {appointment.doctor.specialization.name}
                              </p>
                            </div>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <span style={{
                                fontSize: '0.875rem',
                                color: '#6b7280'
                              }}>
                                📅 Date
                              </span>
                              <p style={{
                                fontWeight: '500',
                                color: '#111827'
                              }}>
                                {date}
                              </p>
                            </div>
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
                            <div>
                              <span style={{
                                fontSize: '0.875rem',
                                color: '#6b7280'
                              }}>
                                📍 Lieu
                              </span>
                              <p style={{
                                fontWeight: '500',
                                color: '#111827'
                              }}>
                                {appointment.doctor.city}
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
                          <Link
                            to={`/doctors/${appointment.doctor.id}`}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              borderRadius: '0.375rem',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}
                          >
                            Voir le médecin
                          </Link>

                          {(appointment.status === 'pending' || appointment.status === 'confirmé') && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              disabled={cancellingId === appointment.id}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: cancellingId === appointment.id ? 'not-allowed' : 'pointer',
                                opacity: cancellingId === appointment.id ? 0.5 : 1
                              }}
                            >
                              {cancellingId === appointment.id ? 'Annulation...' : 'Annuler'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Historique ({pastAppointments.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pastAppointments.map((appointment) => {
                  const { date, time } = formatDateTime(appointment.date_time);
                  return (
                    <div key={appointment.id} style={{
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      padding: '1.5rem',
                      border: '1px solid #e5e7eb',
                      opacity: 0.8
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
                              backgroundColor: '#f3f4f6',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: '#6b7280'
                              }}>
                                {appointment.doctor?.first_name?.charAt(0) || 'D'}{appointment.doctor?.last_name?.charAt(0) || 'R'}
                              </span>
                            </div>
                            <div>
                              <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                marginBottom: '0.25rem'
                              }}>
                                Dr. {appointment.doctor?.first_name || 'Médecin'} {appointment.doctor?.last_name || 'Inconnu'}
                              </h3>
                              <p style={{
                                color: '#9ca3af',
                                fontWeight: '500'
                              }}>
                                {appointment.doctor.specialization.name}
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
                                color: '#9ca3af'
                              }}>
                                📅 {date} à {time}
                              </span>
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
