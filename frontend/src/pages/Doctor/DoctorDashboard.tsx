import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    weekAppointments: 0,
    completedAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('user');

    if (!token || userType !== 'doctor') {
      navigate('/doctor/login');
      return;
    }

    if (userData) {
      setDoctor(JSON.parse(userData));
      loadDashboardData();
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Charger les statistiques du médecin
      const [statsResponse, appointmentsResponse] = await Promise.all([
        apiService.get<any>('/doctors/dashboard/stats/'),
        apiService.get<any>('/doctors/appointments/recent/')
      ]);

      setStats(statsResponse as any);
      setRecentAppointments((appointmentsResponse as any)?.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };



  if (!doctor) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#64748b'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid transparent',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
              </svg>
            </div>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0
              }}>
                CuraTime Médecin
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0
              }}>
                Tableau de bord professionnel
              </p>
            </div>
          </div>


        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0
              }}>
                Bienvenue, Dr. {doctor.first_name} {doctor.last_name}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#64748b',
                margin: 0
              }}>
                {doctor.email}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.5rem',
              border: '1px solid #bae6fd',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0ea5e9' }}>
                {stats.totalPatients}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#0c4a6e' }}>
                Patients Total
              </div>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '0.5rem',
              border: '1px solid #bbf7d0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                {stats.todayAppointments}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#064e3b' }}>
                RDV Aujourd'hui
              </div>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#fefce8',
              borderRadius: '0.5rem',
              border: '1px solid #fde047',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#eab308' }}>
                {stats.weekAppointments}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#713f12' }}>
                RDV Cette Semaine
              </div>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#fdf2f8',
              borderRadius: '0.5rem',
              border: '1px solid #f9a8d4',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ec4899' }}>
                {stats.completedAppointments}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#831843' }}>
                RDV Terminés
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Calendar Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                Calendrier des Rendez-vous
              </h3>
              <button
                onClick={() => navigate('/doctor/appointments')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Voir tout
              </button>
            </div>

            {/* Mini Calendar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} style={{
                  padding: '0.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#64748b'
                }}>
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6; // Adjust for month start
                const isToday = day === new Date().getDate();
                const hasAppointment = [5, 8, 12, 15, 18, 22, 25].includes(day);

                return (
                  <div key={i} style={{
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    backgroundColor: isToday ? '#3b82f6' : hasAppointment ? '#dbeafe' : 'transparent',
                    color: isToday ? 'white' : hasAppointment ? '#1e40af' : day > 0 && day <= 31 ? '#374151' : '#d1d5db',
                    borderRadius: '0.25rem',
                    cursor: day > 0 && day <= 31 ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  }}>
                    {day > 0 && day <= 31 ? day : ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Appointments */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 1.5rem 0'
            }}>
              Prochains Rendez-vous
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                Chargement...
              </div>
            ) : recentAppointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentAppointments.slice(0, 5).map((appointment: any, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#1e293b'
                      }}>
                        {appointment.patient_name || 'Patient'}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        {appointment.time || '10:00'}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      {appointment.reason || 'Consultation générale'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#64748b'
              }}>
                Aucun rendez-vous programmé
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Patients Management */}
          <div
            onClick={() => navigate('/doctor/patients')}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
                  <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Mes Patients
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  {stats.totalPatients} patients
                </p>
              </div>
            </div>
          </div>

          {/* Appointments Management */}
          <div
            onClick={() => navigate('/doctor/appointments')}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#dcfce7',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" fill="#10b981" viewBox="0 0 24 24">
                  <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Rendez-vous
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  {stats.todayAppointments} aujourd'hui
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Management */}
          <div
            onClick={() => navigate('/doctor/schedule')}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" fill="#f59e0b" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Planning
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Gérer les horaires
                </p>
              </div>
            </div>
          </div>

          {/* Profile Management */}
          <div
            onClick={() => navigate('/doctor/profile')}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#fce7f3',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" fill="#ec4899" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Mon Profil
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Informations personnelles
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
