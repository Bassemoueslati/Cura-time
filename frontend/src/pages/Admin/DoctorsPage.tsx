import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import DoctorModal from '../../components/Admin/DoctorModal';

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  specialization: string;
  phone: string;
  is_active: boolean;
  date_joined: string;
  consultation_fee?: number;
  bio?: string;
}

const AdminDoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin via le contexte
    if (!user || user.user_role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadDoctors();
  }, [navigate, user]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<Doctor[]>('/admin/doctors/');
      console.log('Médecins récupérés:', response); // Debug
      setDoctors(response);
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error);
      toast.error('Erreur lors du chargement des médecins');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDoctorStatus = async (doctorId: number) => {
    try {
      const response = await apiService.patch<{is_active: boolean, message: string}>(`/admin/doctors/${doctorId}/toggle-status/`, {});

      // Mettre à jour le statut dans la liste locale
      setDoctors(doctors.map(doctor =>
        doctor.id === doctorId
          ? { ...doctor, is_active: response.is_active }
          : doctor
      ));

      toast.success(response.message);
    } catch (error: any) {
      console.error('Erreur lors du changement de statut:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du changement de statut');
    }
  };



  const handleToggleStatus = async (doctorId: number) => {
    try {
      const doctor = doctors.find(d => d.id === doctorId);
      if (!doctor) return;

      await apiService.patch(`/admin/doctors/${doctorId}/`, {
        is_active: !doctor.is_active
      });

      setDoctors(doctors.map(d =>
        d.id === doctorId ? { ...d, is_active: !d.is_active } : d
      ));

      toast.success(`Médecin ${doctor.is_active ? 'désactivé' : 'activé'} avec succès`);
    } catch (error) {
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Gestion des Médecins
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0.5rem 0 0 0'
            }}>
              Gérer les médecins du système
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

        {/* Header avec Search Bar et bouton Ajouter */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0
            }}>
              Gestion des Médecins ({filteredDoctors.length})
            </h2>

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
              Ajouter un médecin
            </button>
          </div>

          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Rechercher un médecin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <svg
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
              width="16"
              height="16"
              fill="#9ca3af"
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>

        {/* Doctors Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              padding: '4rem',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                border: '2px solid transparent',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              Chargement des médecins...
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div style={{
              padding: '4rem',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <svg
                style={{ margin: '0 auto 1rem', display: 'block' }}
                width="48"
                height="48"
                fill="#d1d5db"
                viewBox="0 0 24 24"
              >
                <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"/>
              </svg>
              {searchTerm ? 'Aucun médecin trouvé pour cette recherche' : 'Aucun médecin enregistré'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Médecin
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Spécialité
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Contact
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Statut
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}>
                            {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
                          </div>
                          <div>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#1e293b'
                            }}>
                              Dr. {doctor.first_name} {doctor.last_name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#64748b'
                            }}>
                              {doctor.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#374151'
                      }}>
                        {doctor.specialization}
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#374151'
                      }}>
                        {doctor.phone}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: doctor.is_active ? '#dcfce7' : '#fef2f2',
                          color: doctor.is_active ? '#166534' : '#dc2626'
                        }}>
                          {doctor.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowEditModal(true);
                            }}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#f0f9ff',
                              color: '#0369a1',
                              border: '1px solid #bae6fd',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#0369a1';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '#f0f9ff';
                              e.currentTarget.style.color = '#0369a1';
                            }}
                          >
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                            </svg>
                          </button>

                          <button
                            onClick={() => handleToggleDoctorStatus(doctor.id)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: doctor.is_active ? '#fef2f2' : '#f0fdf4',
                              color: doctor.is_active ? '#dc2626' : '#16a34a',
                              border: `1px solid ${doctor.is_active ? '#fecaca' : '#bbf7d0'}`,
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              if (doctor.is_active) {
                                e.currentTarget.style.backgroundColor = '#dc2626';
                                e.currentTarget.style.color = 'white';
                              } else {
                                e.currentTarget.style.backgroundColor = '#16a34a';
                                e.currentTarget.style.color = 'white';
                              }
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = doctor.is_active ? '#fef2f2' : '#f0fdf4';
                              e.currentTarget.style.color = doctor.is_active ? '#dc2626' : '#16a34a';
                            }}
                          >
                            {doctor.is_active ? 'Désactiver' : 'Activer'}
                          </button>

                          <button
                            onClick={async () => {
                              if (!window.confirm('Supprimer ce médecin ? Cette action est irréversible.')) return;
                              try {
                                await apiService.delete(`/admin/doctors/${doctor.id}/`);
                                setDoctors(prev => prev.filter(d => d.id !== doctor.id));
                                toast.success('Médecin supprimé avec succès');
                              } catch (err: any) {
                                toast.error(err?.response?.data?.error || 'Erreur lors de la suppression');
                              }
                            }}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#dc2626';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '#fee2e2';
                              e.currentTarget.style.color = '#dc2626';
                            }}
                          >
                            Supprimer
                          </button>


                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <DoctorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={loadDoctors}
        isEdit={false}
      />

      <DoctorModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDoctor(null);
        }}
        onSave={loadDoctors}
        doctor={selectedDoctor}
        isEdit={true}
      />
    </div>
  );
};

export default AdminDoctorsPage;
