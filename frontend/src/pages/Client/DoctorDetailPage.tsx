import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';
import { Doctor, AppointmentCreate } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { toast } from 'react-toastify';

const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const doctorData = await doctorService.getDoctorById(parseInt(id));
        setDoctor(doctorData);

        // Quick booking prefill from list page
        const qb = localStorage.getItem('quickBooking');
        if (qb) {
          try {
            const { doctorId, date, time } = JSON.parse(qb);
            if (doctorId === doctorData.id) {
              setSelectedDate(date);
              setSelectedTime(time);
            }
          } catch {}
          localStorage.removeItem('quickBooking');
        }
      } catch (err: any) {
        setError('Erreur lors du chargement du médecin');
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBookAppointment = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour prendre un rendez-vous');
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }

    if (!doctor) return;

    try {
      setBookingLoading(true);
      const appointmentData: AppointmentCreate = {
        doctor: doctor.id,
        date_time: `${selectedDate}T${selectedTime}:00`
      };

      await appointmentService.createAppointment(appointmentData);
      toast.success('Rendez-vous pris avec succès !');
      navigate('/appointments');
    } catch (err: any) {
      toast.error('Erreur lors de la prise de rendez-vous');
      console.error('Error booking appointment:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const getAvailableDates = () => {
    if (!doctor?.availability) return [];
    return Object.keys(doctor.availability).sort();
  };

  const getAvailableTimes = (date: string) => {
    if (!doctor?.availability || !doctor.availability[date]) return [];
    return doctor.availability[date];
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div style={{ padding: '2rem' }}>
        <ErrorMessage message={error || 'Médecin non trouvé'} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '1fr 400px' : '1fr',
        gap: '2rem'
      }}>
        {/* Doctor Info */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <div style={{
              height: '300px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '150px',
                  height: '150px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: '4rem',
                    fontWeight: '600',
                    color: '#2563eb'
                  }}>
                    {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div style={{ padding: '2rem' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Dr. {doctor.first_name} {doctor.last_name}
              </h1>

              <p style={{
                color: '#2563eb',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {doctor.specialization.name}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    📍 Adresse
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    {doctor.address}<br />
                    {doctor.city}, {doctor.state} {doctor.zip_code}
                  </p>
                </div>

                <div>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    📞 Téléphone
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    {doctor.phone}
                  </p>
                </div>

                <div>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    📧 Email
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    {doctor.email}
                  </p>
                </div>

                {doctor.consultation_fee && (
                  <div>
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      💰 Tarif
                    </h3>
                    <p style={{
                      color: '#059669',
                      fontWeight: '600'
                    }}>
                      {doctor.consultation_fee}€ / consultation
                    </p>
                  </div>
                )}
              </div>

              {doctor.bio && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    À propos
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    {doctor.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Appointment Booking */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            position: 'sticky',
            top: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              Prendre rendez-vous
            </h2>

            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Date Selection */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Choisir une date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(''); // Reset time when date changes
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Sélectionner une date</option>
                    {getAvailableDates().map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Choisir un horaire
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.5rem'
                    }}>
                      {getAvailableTimes(selectedDate).map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          style={{
                            padding: '0.5rem',
                            border: selectedTime === time ? '2px solid #2563eb' : '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            backgroundColor: selectedTime === time ? '#dbeafe' : 'white',
                            color: selectedTime === time ? '#2563eb' : '#374151',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime || bookingLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: (!selectedDate || !selectedTime || bookingLoading) ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: (!selectedDate || !selectedTime || bookingLoading) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '1rem'
                  }}
                >
                  {bookingLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Réservation...
                    </>
                  ) : (
                    <>
                      📅 Confirmer le rendez-vous
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Connexion requise
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '1.5rem'
                }}>
                  Vous devez être connecté pour prendre un rendez-vous
                </p>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Se connecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
