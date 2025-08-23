import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../../services/apiService';

interface Doctor {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  consultation_fee?: number;
  bio?: string;
}

interface Specialty {
  id: number;
  name: string;
}

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  doctor?: Doctor | null;
  isEdit?: boolean;
}

const DoctorModal: React.FC<DoctorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  doctor, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState<Doctor>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialization: '',
    consultation_fee: 0,
    bio: ''
  });
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSpecialties();
      if (isEdit && doctor) {
        setFormData({
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          email: doctor.email,
          phone: doctor.phone,
          specialization: doctor.specialization,
          consultation_fee: doctor.consultation_fee || 0,
          bio: doctor.bio || ''
        });
      } else {
        // Reset form for new doctor
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          specialization: '',
          consultation_fee: 0,
          bio: ''
        });
        setPassword('');
      }
    }
  }, [isOpen, isEdit, doctor]);

  const loadSpecialties = async () => {
    try {
      const response = await apiService.get<any>('/admin/specialties/');
      const list: Specialty[] = Array.isArray(response)
        ? response
        : (response?.specialties || []);

      // Si on est en édition et que la spécialité actuelle n'est pas dans la liste, on l'ajoute temporairement
      if (isEdit && doctor && doctor.specialization && !list.find(s => s.name === doctor.specialization)) {
        list.push({ id: -1, name: doctor.specialization });
      }

      setSpecialties(list);
    } catch (error: any) {
      console.error('Erreur lors du chargement des spécialités:', error);
      // Alerter l'admin si la récupération échoue (ex: 401/403)
      // Pour éviter un modal vide sans explication
      try {
        const msg = error?.response?.data?.message || error?.response?.data?.error || 'Impossible de charger les spécialités';
        // eslint-disable-next-line no-alert
        console.warn(msg);
      } catch {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.specialization) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!isEdit && !password) {
      toast.error('Le mot de passe est obligatoire pour un nouveau médecin');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        ...((!isEdit && password) && { password })
      };

      if (isEdit && doctor?.id) {
        await apiService.put(`/admin/doctors/${doctor.id}/`, submitData);
        toast.success('Médecin modifié avec succès');
      } else {
        await apiService.post('/admin/doctors/', submitData);
        toast.success('Médecin ajouté avec succès');
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Erreur lors de la sauvegarde';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0
          }}>
            {isEdit ? 'Modifier le médecin' : 'Ajouter un médecin'}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Prénom *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                required
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Nom *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>

          {!isEdit && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Mot de passe *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                required={!isEdit}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Tarif consultation (€)
              </label>
              <input
                type="number"
                value={formData.consultation_fee}
                onChange={(e) => setFormData({...formData, consultation_fee: Number(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                min="0"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Spécialité *
            </label>
            <select
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              required
            >
              <option value="">Sélectionner une spécialité</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.name}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Biographie
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
              placeholder="Décrivez l'expérience et les qualifications du médecin..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sauvegarde...' : (isEdit ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;
