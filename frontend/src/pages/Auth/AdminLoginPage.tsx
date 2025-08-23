import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { UserLogin } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>();

  const onSubmit = async (data: UserLogin) => {
    console.log('🔐 Admin login attempt:', data);
    setIsLoading(true);
    try {
      // Utiliser la méthode spécialisée pour la connexion admin
      await loginAdmin(data);
      console.log('✅ Admin login successful');

      // Navigation vers le dashboard admin
      setTimeout(() => {
        console.log('📍 Executing navigation to /admin/dashboard');
        navigate('/admin/dashboard');
      }, 500);
    } catch (error: any) {
      console.error('❌ Admin login error:', error);
      // Le toast d'erreur est déjà géré dans loginAdmin
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '2.5rem',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)'
          }}>
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '0.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Connexion Administrateur
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            Accédez au panneau d'administration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Adresse email administrateur
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide',
                  },
                })}
                type="email"
                placeholder="admin@curatime.com"
                style={{
                  width: '85%',
                  padding: '1rem 3rem 1rem 1rem',
                  border: errors.email ? '2px solid #ef4444' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.2s ease-in-out',
                  outline: 'none',
                  color: '#374151',
                  fontWeight: '400'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <svg width="20" height="20" fill="#9ca3af" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            {errors.email && (
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"/>
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Mot de passe administrateur
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password', {
                  required: 'Le mot de passe est requis',
                  minLength: {
                    value: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères',
                  },
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe administrateur"
                style={{
                  width: '85%',
                  padding: '1rem 3rem 1rem 1rem',
                  border: errors.password ? '2px solid #ef4444' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.2s ease-in-out',
                  outline: 'none',
                  color: '#374151',
                  fontWeight: '400'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '0.25rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#6b7280'}
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"/>
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem 1.5rem',
              background: isLoading ? '#9ca3af' : '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              outline: 'none'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(124, 58, 237, 0.3)';
                e.currentTarget.style.backgroundColor = '#6d28d9';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.backgroundColor = '#7c3aed';
              }
            }}
          >
            {isLoading && <LoadingSpinner size="sm" />}
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Links */}
        <div style={{
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0',
          marginTop: '1.5rem'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            marginBottom: '1rem'
          }}>
            Vous n'êtes pas administrateur ?
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #3b82f6',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#3b82f6';
              }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"/>
              </svg>
              Connexion patient
            </Link>
            <Link
              to="/doctor/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#0ea5e9',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #0ea5e9',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0ea5e9';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0ea5e9';
              }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
              </svg>
              Connexion médecin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
