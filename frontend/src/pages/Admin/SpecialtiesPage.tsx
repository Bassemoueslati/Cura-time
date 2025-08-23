import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface Specialty {
  id: number;
  name: string;
  doctors_count: number;
}

const AdminSpecialtiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSpecialtyName, setNewSpecialtyName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin via le contexte
    if (!user || user.user_role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadSpecialties();
  }, [navigate, user]);

  const loadSpecialties = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<Specialty[]>('/admin/specialties/');
      setSpecialties(response);
    } catch (error) {
      console.error('Erreur lors du chargement des spécialités:', error);
      toast.error('Erreur lors du chargement des spécialités');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecialty = async () => {
    if (!newSpecialtyName.trim()) {
      toast.error('Veuillez saisir un nom de spécialité');
      return;
    }

    try {
      setIsAdding(true);
      const response = await apiService.post<Specialty>('/admin/specialties/', {
        name: newSpecialtyName.trim()
      });
      
      setSpecialties([...specialties, response]);
      setNewSpecialtyName('');
      toast.success('Spécialité ajoutée avec succès');
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSpecialty = async (specialtyId: number) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    if (!specialty) return;

    if (specialty.doctors_count > 0) {
      toast.error(`Impossible de supprimer cette spécialité. ${specialty.doctors_count} médecin(s) l'utilisent encore.`);
      return;
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la spécialité "${specialty.name}" ?`)) {
      return;
    }

    try {
      await apiService.delete(`/admin/specialties/${specialtyId}/`);
      setSpecialties(specialties.filter(s => s.id !== specialtyId));
      toast.success('Spécialité supprimée avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
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
              Gestion des Spécialités
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0.5rem 0 0 0'
            }}>
              Gérer les spécialités médicales du système
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

        {/* Add New Specialty */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            Ajouter une nouvelle spécialité
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              value={newSpecialtyName}
              onChange={(e) => setNewSpecialtyName(e.target.value)}
              placeholder="Nom de la spécialité"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddSpecialty();
                }
              }}
            />
            <button
              onClick={handleAddSpecialty}
              disabled={isAdding || !newSpecialtyName.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isAdding || !newSpecialtyName.trim() ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isAdding || !newSpecialtyName.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isAdding ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>

        {/* Specialties List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0
            }}>
              Liste des spécialités ({specialties.length})
            </h2>
          </div>

          {specialties.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
              <p>Aucune spécialité trouvée</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Spécialité
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Nombre de médecins
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {specialties.map((specialty, index) => (
                    <tr key={specialty.id} style={{
                      borderBottom: index < specialties.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        fontWeight: '500'
                      }}>
                        {specialty.name}
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#374151'
                      }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: specialty.doctors_count > 0 ? '#dbeafe' : '#f3f4f6',
                          color: specialty.doctors_count > 0 ? '#1e40af' : '#6b7280'
                        }}>
                          {specialty.doctors_count} médecin{specialty.doctors_count !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteSpecialty(specialty.id)}
                          disabled={specialty.doctors_count > 0}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: specialty.doctors_count > 0 ? '#f9fafb' : '#fef2f2',
                            color: specialty.doctors_count > 0 ? '#9ca3af' : '#dc2626',
                            border: `1px solid ${specialty.doctors_count > 0 ? '#e5e7eb' : '#fecaca'}`,
                            borderRadius: '0.375rem',
                            cursor: specialty.doctors_count > 0 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.875rem'
                          }}
                          title={specialty.doctors_count > 0 ? 'Impossible de supprimer: des médecins utilisent cette spécialité' : 'Supprimer cette spécialité'}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSpecialtiesPage;
