import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { Appointment, Doctor } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [appointmentsData, doctorsData] = await Promise.all([
          appointmentService.getClientAppointments().catch(() => []),
          doctorService.getAllDoctors().catch(() => [])
        ]);
        setAppointments(appointmentsData);
        setDoctors(doctorsData.slice(0, 3)); // Show only first 3 doctors
      } catch (err: any) {
        setError('Erreur lors du chargement des données');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date_time) > new Date())
    .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
    .slice(0, 3);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

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
          Bonjour, {user?.first_name} ! 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          Bienvenue sur votre espace patient CuraTime
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
              {upcomingAppointments.length}
            </span>
          </div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            Rendez-vous à venir
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Prochaines consultations
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
              🩺
            </div>
            <span style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#059669'
            }}>
              {doctors.length}+
            </span>
          </div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            Médecins disponibles
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Spécialistes à votre service
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
              📋
            </div>
            <span style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#d97706'
            }}>
              {appointments.length}
            </span>
          </div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            Total consultations
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Historique complet
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '2fr 1fr' : '1fr',
        gap: '2rem'
      }}>
        {/* Upcoming Appointments */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
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
              Prochains rendez-vous
            </h2>
            <Link
              to="/appointments"
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

          {upcomingAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingAppointments.map((appointment) => {
                const { date, time } = formatDateTime(appointment.date_time);
                return (
                  <div key={appointment.id} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#2563eb'
                        }}>
                          {appointment.doctor.first_name.charAt(0)}{appointment.doctor.last_name.charAt(0)}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '0.25rem'
                        }}>
                          Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                        </h3>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.875rem'
                        }}>
                          {appointment.doctor.specialization.name}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#111827'
                        }}>
                          {date}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          {time}
                        </p>
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
                Aucun rendez-vous à venir
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem'
              }}>
                Prenez rendez-vous avec un spécialiste
              </p>
              <Link
                to="/doctors"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Prendre rendez-vous
                <span style={{ marginLeft: '0.5rem' }}>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Actions rapides
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              to="/doctors"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                color: '#111827',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dbeafe',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                🔍
              </div>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  Trouver un médecin
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Parcourir les spécialistes
                </p>
              </div>
            </Link>

            <Link
              to="/appointments"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                color: '#111827',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dcfce7',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                📋
              </div>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  Mes rendez-vous
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Gérer vos consultations
                </p>
              </div>
            </Link>

            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                color: '#111827',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fef3c7',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                👤
              </div>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  Mon profil
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Modifier vos informations
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '2rem' }}>
          <ErrorMessage message={error} />
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
