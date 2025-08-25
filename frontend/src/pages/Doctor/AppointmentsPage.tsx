import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../contexts/AuthContext';
import { Appointment, Doctor } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { toast } from 'react-toastify';

const DoctorAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [availabilityMode, setAvailabilityMode] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsData] = await Promise.all([
          appointmentService.getDoctorAppointments(),
        ]);
        setAppointments(appointmentsData);

        // Try to get doctor profile if available
        try {
          const doctors = await doctorService.getAllDoctors();
          const currentDoctor = doctors.find(doc => doc.email === user?.email);
          if (currentDoctor) {
            setDoctorProfile(currentDoctor);
          }
        } catch (err) {
          console.log('Could not fetch doctor profile');
        }
      } catch (err: any) {
        setError('Erreur lors du chargement des données');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleStatusUpdate = async (appointmentId: number, newStatus: 'pending' | 'terminé' | 'confirmé') => {
    try {
      setUpdatingStatus(appointmentId);
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);

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

  const sortedAppointments = appointments.sort((a, b) =>
    new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
  );

  const upcomingAppointments = sortedAppointments.filter(apt => isUpcoming(apt.date_time));
  const pastAppointments = sortedAppointments.filter(apt => !isUpcoming(apt.date_time));

  const getAvailableSlots = (date: string) => {
    if (!doctorProfile?.availability || !doctorProfile.availability[date]) {
      return [];
    }
    return doctorProfile.availability[date];
  };

  const addTimeSlot = () => {
    if (!newTimeSlot || !selectedDate) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }

    // This would normally call an API to update doctor availability
    toast.info('Fonctionnalité de gestion des créneaux à implémenter côté API');
    setNewTimeSlot('');
  };

  const removeTimeSlot = (date: string, time: string) => {
    // This would normally call an API to update doctor availability
    toast.info('Fonctionnalité de suppression des créneaux à implémenter côté API');
  };

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
      <div style={{ marginBottom: '2rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Gestion des Patients
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Consultez et gérez vos rendez-vous patients
          </p>
        </div>
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = '/doctor/dashboard')}
          style={{
            padding: '.65rem 1rem',
            borderRadius: '.5rem',
            border: '1px solid #e5e7eb',
            background: 'white',
            color: '#111827',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onMouseOver={(e)=> e.currentTarget.style.background = '#f8fafc'}
          onMouseOut={(e)=> e.currentTarget.style.background = 'white'}
        >
          ← Retour
        </button>
      </div>

      {/* Toggle between appointments and availability */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        <button
          onClick={() => setAvailabilityMode(false)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: !availabilityMode ? '#2563eb' : 'transparent',
            color: !availabilityMode ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          📋 Rendez-vous
        </button>
        <button
          onClick={() => setAvailabilityMode(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: availabilityMode ? '#2563eb' : 'transparent',
            color: availabilityMode ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          📅 Disponibilités
        </button>
      </div>

      {!availabilityMode ? (
        /* Appointments View */
        <div>
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
              <p style={{ color: '#6b7280' }}>
                Vous n'avez pas encore de rendez-vous programmé
              </p>
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
                                    {appointment.client.first_name.charAt(0)}{appointment.client.last_name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <h3 style={{
                                    fontSize: '1.25rem',
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
                                  {appointment.client.adresse && (
                                    <p style={{
                                      color: '#6b7280',
                                      fontSize: '0.875rem'
                                    }}>
                                      📍 {appointment.client.adresse}
                                    </p>
                                  )}
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
                                    📋 Créé le
                                  </span>
                                  <p style={{
                                    fontWeight: '500',
                                    color: '#111827'
                                  }}>
                                    {new Date(appointment.created_at).toLocaleDateString('fr-FR')}
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
                    {pastAppointments.slice(0, 5).map((appointment) => {
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
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
                                {appointment.client.first_name.charAt(0)}{appointment.client.last_name.charAt(0)}
                              </span>
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                marginBottom: '0.25rem'
                              }}>
                                {appointment.client.first_name} {appointment.client.last_name}
                              </h3>
                              <p style={{
                                color: '#9ca3af',
                                fontSize: '0.875rem'
                              }}>
                                📅 {date} à {time}
                              </p>
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
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Availability Management View */
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Gestion des Disponibilités
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
            gap: '2rem'
          }}>
            {/* Date Selection */}
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Sélectionner une date
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
              />

              {/* Add Time Slot */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Ajouter un créneau
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="time"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button
                    onClick={addTimeSlot}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            {/* Current Availability */}
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Créneaux disponibles pour le {new Date(selectedDate).toLocaleDateString('fr-FR')}
              </h3>

              {doctorProfile ? (
                <div>
                  {getAvailableSlots(selectedDate).length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      {getAvailableSlots(selectedDate).map((time, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}>
                          <span>{time}</span>
                          <button
                            onClick={() => removeTimeSlot(selectedDate, time)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      Aucun créneau disponible pour cette date
                    </p>
                  )}
                </div>
              ) : (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#fef3c7',
                  borderRadius: '0.375rem'
                }}>
                  <p style={{ color: '#92400e' }}>
                    ⚠️ Profil médecin non trouvé. La gestion des disponibilités nécessite un profil médecin complet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.375rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: '0.5rem'
            }}>
              ℹ️ Information
            </h4>
            <p style={{
              color: '#1e40af',
              fontSize: '0.875rem'
            }}>
              La gestion complète des disponibilités nécessite une API dédiée côté backend.
              Cette interface montre la structure prévue pour cette fonctionnalité.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
