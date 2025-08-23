import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface Appointment {
  id: number;
  doctor: {
    id: number;
    first_name: string;
    last_name: string;
    specialization: string;
  };
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  date_time: string;
  status: string;
}

const AdminAppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    // Vérifier si l'utilisateur est admin via le contexte
    if (!user || user.user_role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadAppointments();
  }, [navigate, user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<Appointment[]>('/admin/appointments/list/');
      setAppointments(response);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions utilitaires pour le calendrier
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date_time.startsWith(dateStr));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              Supervision des Rendez-vous
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0.5rem 0 0 0'
            }}>
              Consultation et supervision des rendez-vous du système
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
          >
            ← Retour au Dashboard
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            {/* Calendrier */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              {/* En-tête du calendrier */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <button
                  onClick={() => navigateMonth(-1)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ←
                </button>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={() => navigateMonth(1)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  →
                </button>
              </div>

              {/* Jours de la semaine */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '1px',
                marginBottom: '1rem'
              }}>
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                  <div key={day} style={{
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    backgroundColor: '#f8fafc'
                  }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille du calendrier */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '1px'
              }}>
                {/* Cases vides pour les jours précédents */}
                {Array.from({ length: getFirstDayOfMonth(currentMonth) }, (_, i) => (
                  <div key={`empty-${i}`} style={{ height: '60px', backgroundColor: '#f8fafc' }} />
                ))}

                {/* Jours du mois */}
                {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                  const day = i + 1;
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dayAppointments = getAppointmentsForDate(date);
                  const isSelected = selectedDate.toDateString() === date.toDateString();
                  const isToday = new Date().toDateString() === date.toDateString();

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      style={{
                        height: '60px',
                        padding: '0.25rem',
                        backgroundColor: isSelected ? '#dbeafe' : isToday ? '#fef3c7' : 'white',
                        border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: isToday ? '600' : '400',
                        color: isToday ? '#92400e' : '#374151'
                      }}>
                        {day}
                      </span>
                      {dayAppointments.length > 0 && (
                        <div style={{
                          fontSize: '0.625rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '0.25rem',
                          padding: '0.125rem 0.25rem',
                          textAlign: 'center'
                        }}>
                          {dayAppointments.length} RDV
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panneau des détails du jour sélectionné */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              maxHeight: '600px',
              overflowY: 'auto'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1rem'
              }}>
                Rendez-vous du {formatDate(selectedDate)}
              </h3>

              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#64748b'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                  <p>Aucun rendez-vous ce jour</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {getAppointmentsForDate(selectedDate).map((appointment) => (
                    <div
                      key={appointment.id}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: '#f9fafb'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '0.5rem'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#1e293b'
                          }}>
                            {new Date(appointment.date_time).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748b'
                          }}>
                            Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                          </div>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.625rem',
                          fontWeight: '600',
                          backgroundColor: appointment.status === 'pending' ? '#fef3c7' :
                                         appointment.status === 'confirmé' ? '#dcfce7' : '#fee2e2',
                          color: appointment.status === 'pending' ? '#92400e' :
                                appointment.status === 'confirmé' ? '#166534' : '#dc2626'
                        }}>
                          {appointment.status === 'pending' ? 'En attente' :
                           appointment.status === 'confirmé' ? 'Confirmé' :
                           appointment.status === 'terminé' ? 'Terminé' : appointment.status}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {appointment.client.first_name[0]}{appointment.client.last_name[0]}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#1e293b'
                          }}>
                            {appointment.client.first_name} {appointment.client.last_name}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748b'
                          }}>
                            {appointment.client.email}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        Spécialité: {appointment.doctor.specialization}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
