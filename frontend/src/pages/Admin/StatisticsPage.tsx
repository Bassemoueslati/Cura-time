import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface Statistics {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  monthlyAppointments: { month: string; count: number }[];
  specialtyStats: { specialty: string; count: number }[];
}

const AdminStatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<Statistics>({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    monthlyAppointments: [],
    specialtyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.user_role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadStatistics();
  }, [navigate, user]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<Statistics>('/admin/dashboard/stats/');
      setStats(response);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // Données de démonstration
      setStats({
        totalDoctors: 12,
        totalPatients: 245,
        totalAppointments: 1834,
        todayAppointments: 8,
        pendingAppointments: 23,
        completedAppointments: 1756,
        monthlyAppointments: [
          { month: 'Jan', count: 145 },
          { month: 'Fév', count: 167 },
          { month: 'Mar', count: 189 },
          { month: 'Avr', count: 156 },
          { month: 'Mai', count: 198 },
          { month: 'Juin', count: 234 }
        ],
        specialtyStats: [
          { specialty: 'Cardiologie', count: 45 },
          { specialty: 'Dermatologie', count: 38 },
          { specialty: 'Neurologie', count: 29 },
          { specialty: 'Pédiatrie', count: 52 },
          { specialty: 'Orthopédie', count: 31 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
              Statistiques Globales
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0.5rem 0 0 0'
            }}>
              Vue d'ensemble des performances du système
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
          >
            ← Retour au tableau de bord
          </button>
        </div>

        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '0.5rem' }}>
                  {stats.totalDoctors}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                  Médecins Total
                </div>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                👨‍⚕️
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
                  {stats.totalPatients}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                  Patients Total
                </div>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                👥
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem' }}>
                  {stats.totalAppointments}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                  RDV Total
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '500', marginTop: '0.25rem' }}>
                  +{stats.todayAppointments} aujourd'hui
                </div>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                📅
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem' }}>
                  {stats.pendingAppointments}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                  En Attente
                </div>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                ⏳
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Monthly Appointments Chart */}
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
              marginBottom: '1.5rem'
            }}>
              Rendez-vous par mois
            </h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
              {stats.monthlyAppointments.map((item, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    backgroundColor: '#3b82f6',
                    borderRadius: '0.25rem 0.25rem 0 0',
                    height: `${(item.count / Math.max(...stats.monthlyAppointments.map(m => m.count))) * 150}px`,
                    minHeight: '20px',
                    marginBottom: '0.5rem'
                  }}></div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                    {item.month}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: '600' }}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specialty Distribution */}
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
              marginBottom: '1.5rem'
            }}>
              Répartition par spécialité
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.specialtyStats.map((item, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                const color = colors[index % colors.length];
                const maxCount = Math.max(...stats.specialtyStats.map(s => s.count));
                const percentage = (item.count / maxCount) * 100;
                
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ minWidth: '100px', fontSize: '0.875rem', color: '#374151' }}>
                      {item.specialty}
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: '0.5rem', height: '8px' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '0.5rem'
                      }}></div>
                    </div>
                    <div style={{ minWidth: '30px', fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                      {item.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Taux de réussite
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `conic-gradient(#10b981 0deg ${(stats.completedAppointments / stats.totalAppointments) * 360}deg, #f3f4f6 ${(stats.completedAppointments / stats.totalAppointments) * 360}deg 360deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {Math.round((stats.completedAppointments / stats.totalAppointments) * 100)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Rendez-vous terminés
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                  {stats.completedAppointments}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  sur {stats.totalAppointments} total
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Activité récente
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                  {stats.todayAppointments} nouveaux RDV aujourd'hui
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                  {stats.pendingAppointments} RDV en attente
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                  {stats.totalDoctors} médecins actifs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticsPage;
