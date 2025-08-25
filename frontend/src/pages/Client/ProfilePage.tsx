import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileUpdateForm } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileUpdateForm>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      adresse: user?.adresse || '',
      gender: user?.gender || ''
    }
  });

  const onSubmit = async (data: ProfileUpdateForm) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleCancel = () => {
    reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      adresse: user?.adresse || '',
      gender: user?.gender || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Mon Profil
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Gérez vos informations personnelles
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = '/dashboard')}
          style={{
            padding: '.6rem .9rem',
            border: '1px solid #e5e7eb',
            borderRadius: '.5rem',
            background: 'white',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onMouseOver={(e)=> (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'}
          onMouseOut={(e)=> (e.currentTarget as HTMLButtonElement).style.background = 'white'}
        >
          ← Retour
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Profile Header */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontSize: '2rem',
                fontWeight: '600',
                color: '#2563eb'
              }}>
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.25rem'
              }}>
                {user.first_name} {user.last_name}
              </h2>
              <p style={{ color: '#6b7280' }}>
                {user.email}
              </p>
              <div style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: user.is_active ? '#dcfce7' : '#fee2e2',
                color: user.is_active ? '#166534' : '#dc2626'
              }}>
                {user.is_active ? 'Compte actif' : 'Compte inactif'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div style={{ padding: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Informations personnelles
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
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
                ✏️ Modifier
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* First Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Prénom
                </label>
                {isEditing ? (
                  <input
                    {...register('first_name', {
                      required: 'Le prénom est requis',
                      minLength: {
                        value: 2,
                        message: 'Le prénom doit contenir au moins 2 caractères',
                      },
                    })}
                    type="text"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                ) : (
                  <p style={{
                    padding: '0.75rem 0',
                    color: '#111827',
                    fontWeight: '500'
                  }}>
                    {user.first_name}
                  </p>
                )}
                {errors.first_name && (
                  <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Nom
                </label>
                {isEditing ? (
                  <input
                    {...register('last_name', {
                      required: 'Le nom est requis',
                      minLength: {
                        value: 2,
                        message: 'Le nom doit contenir au moins 2 caractères',
                      },
                    })}
                    type="text"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                ) : (
                  <p style={{
                    padding: '0.75rem 0',
                    color: '#111827',
                    fontWeight: '500'
                  }}>
                    {user.last_name}
                  </p>
                )}
                {errors.last_name && (
                  <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Email
                </label>
                {isEditing ? (
                  <input
                    {...register('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Adresse email invalide',
                      },
                    })}
                    type="email"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                ) : (
                  <p style={{
                    padding: '0.75rem 0',
                    color: '#111827',
                    fontWeight: '500'
                  }}>
                    {user.email}
                  </p>
                )}
                {errors.email && (
                  <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Genre
                </label>
                {isEditing ? (
                  <select
                    {...register('gender', {
                      required: 'Le genre est requis',
                    })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Sélectionnez votre genre</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                ) : (
                  <p style={{
                    padding: '0.75rem 0',
                    color: '#111827',
                    fontWeight: '500'
                  }}>
                    {user.gender === 'M' ? 'Homme' : user.gender === 'F' ? 'Femme' : user.gender || 'Non spécifié'}
                  </p>
                )}
                {errors.gender && (
                  <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Adresse
              </label>
              {isEditing ? (
                <textarea
                  {...register('adresse', {
                    required: 'L\'adresse est requise',
                  })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              ) : (
                <p style={{
                  padding: '0.75rem 0',
                  color: '#111827',
                  fontWeight: '500',
                  lineHeight: '1.5'
                }}>
                  {user.adresse}
                </p>
              )}
              {errors.adresse && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#dc2626' }}>
                  {errors.adresse.message}
                </p>
              )}
            </div>

            {/* Account Info */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Informations du compte
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Type de compte
                  </span>
                  <p style={{
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {user.user_role === 'client' ? 'Patient' : user.user_role}
                  </p>
                </div>
                <div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Membre depuis
                  </span>
                  <p style={{
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {new Date(user.date_joined).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Enregistrement...
                    </>
                  ) : (
                    '💾 Enregistrer'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
