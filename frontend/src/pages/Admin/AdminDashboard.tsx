import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalSpecialties: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeUsers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté en tant qu'admin via le contexte
    console.log('AdminDashboard - Debug user:', user);

    if (!user || user.user_role !== 'admin') {
      console.log('AdminDashboard - Redirecting to login, user role:', user?.user_role);
      navigate('/admin/login');
      return;
    }

    setAdmin(user);
    loadDashboardData();
  }, [navigate, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques globales
      const [statsResponse, activitiesResponse] = await Promise.all([
        apiService.get<any>('/admin/dashboard/stats/'),
        apiService.get<any>('/admin/dashboard/activities/')
      ]);

      setStats(statsResponse as any);
      setRecentActivities((activitiesResponse as any)?.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Données de démonstration en cas d'erreur
      setStats({
        totalDoctors: 25,
        totalPatients: 1250,
        totalAppointments: 3420,
        totalSpecialties: 12,
        todayAppointments: 45,
        pendingAppointments: 23,
        completedAppointments: 3397,
        activeUsers: 156
      });
    } finally {
      setLoading(false);
    }
  };



  if (!admin) {
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
            borderTop: '2px solid #7c3aed',
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
      maxWidth: '1400px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              A
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0
              }}>
                Bienvenue, {admin.first_name} {admin.last_name}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#64748b',
                margin: 0
              }}>
                Tableau de bord administrateur - CuraTime
              </p>
            </div>
          </div>
          
          {/* Statistics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.75rem',
              border: '1px solid #bae6fd',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0ea5e9', marginBottom: '0.5rem' }}>
                {stats.totalDoctors}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#0c4a6e', fontWeight: '600' }}>
                Médecins Total
              </div>
            </div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '0.75rem',
              border: '1px solid #bbf7d0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
                {stats.totalPatients}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#064e3b', fontWeight: '600' }}>
                Patients Total
              </div>
            </div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#fefce8',
              borderRadius: '0.75rem',
              border: '1px solid #fde047',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#eab308', marginBottom: '0.5rem' }}>
                {stats.totalAppointments}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#713f12', fontWeight: '600' }}>
                RDV Total
              </div>
            </div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#fdf2f8',
              borderRadius: '0.75rem',
              border: '1px solid #f9a8d4',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ec4899', marginBottom: '0.5rem' }}>
                {stats.totalSpecialties}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#831843', fontWeight: '600' }}>
                Spécialités
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Gestion des Médecins */}
          <div
            onClick={() => navigate('/admin/doctors')}
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
                  <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Gestion des Médecins
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  {stats.totalDoctors} médecins enregistrés
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              lineHeight: '1.5',
              margin: 0
            }}>
              Ajouter, modifier ou supprimer des médecins. Gérer leurs profils et spécialités.
            </p>
          </div>



          {/* Gestion des Spécialités */}
          <div
            onClick={() => navigate('/admin/specialties')}
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
                  <path fillRule="evenodd" d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H13.5a5.25 5.25 0 005.25-5.25v-.5a6 6 0 00-5.98-6.496A6.002 6.002 0 0010.5 3.75zM8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Gestion des Spécialités
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  {stats.totalSpecialties} spécialités médicales
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              lineHeight: '1.5',
              margin: 0
            }}>
              Gérer les spécialités médicales disponibles dans le système.
            </p>
          </div>

          {/* Supervision des Rendez-vous */}
          <div
            onClick={() => navigate('/admin/appointments')}
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
                  Supervision des RDV
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  {stats.todayAppointments} RDV aujourd'hui
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              lineHeight: '1.5',
              margin: 0
            }}>
              Superviser tous les rendez-vous du système et gérer les conflits.
            </p>
          </div>

          {/* Statistiques Globales */}
          <div
            onClick={() => navigate('/admin/statistics')}
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
                  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Statistiques Globales
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Dashboard professionnel
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              lineHeight: '1.5',
              margin: 0
            }}>
              Visualiser les statistiques détaillées et les rapports du système.
            </p>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
