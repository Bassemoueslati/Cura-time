import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { UserRegistration } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { toast } from 'react-toastify';

const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserRegistration & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: UserRegistration & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '0.75rem 1rem',
    border: hasError ? '2px solid #ef4444' : '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s',
    outline: 'none'
  });

  const inputFocusStyle = {
    backgroundColor: 'white',
    borderColor: '#10b981',
    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
  };

  const inputBlurStyle = {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    boxShadow: 'none'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '32rem',
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
          }}>
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '0.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Créer un compte
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            Ou{' '}
            <Link
              to="/login"
              style={{
                color: '#10b981',
                fontWeight: '600',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.color = '#10b981'}
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Name Fields */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth > 640 ? '1fr 1fr' : '1fr', 
            gap: '3rem' 
          }}>
            {/* First Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Prénom
              </label>
              <input
                {...register('first_name', {
                  required: 'Le prénom est requis',
                  minLength: {
                    value: 2,
                    message: 'Le prénom doit contenir au moins 2 caractères',
                  },
                })}
                type="text"
                placeholder="Votre prénom"
                style={inputStyle(!!errors.first_name)}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
              {errors.first_name && (
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
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Nom
              </label>
              <input
                {...register('last_name', {
                  required: 'Le nom est requis',
                  minLength: {
                    value: 2,
                    message: 'Le nom doit contenir au moins 2 caractères',
                  },
                })}
                type="text"
                placeholder="Votre nom"
                style={inputStyle(!!errors.last_name)}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
              {errors.last_name && (
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
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Adresse email
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
                placeholder="votre@email.com"
                style={{
                  ...inputStyle(!!errors.email),
                  paddingRight: '1rem'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
              <div style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <svg width="20" height="20" fill="#9ca3af" viewBox="0 0 24 24">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
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

          {/* Password Fields */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth > 640 ? '1fr 1fr' : '1fr', 
            gap: '3rem' 
          }}>
            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Mot de passe
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
                  placeholder="Mot de passe"
                  style={{
                    ...inputStyle(!!errors.password),
                    paddingRight: '1rem'
                  }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
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
                  gap: '1rem'
                }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"/>
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Confirmer le mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('confirmPassword', {
                    required: 'Veuillez confirmer votre mot de passe',
                    validate: (value) =>
                      value === password || 'Les mots de passe ne correspondent pas',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmer le mot de passe"
                  style={{
                    ...inputStyle(!!errors.confirmPassword),
                    paddingRight: '1rem'
                  }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.0025rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '0.25rem'
                  }}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"/>
                  </svg>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
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
              padding: '0.875rem 1.5rem',
              background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              outline: 'none',
              marginTop: '0.5rem'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            )}
            {isLoading ? 'Création du compte...' : 'Créer mon compte'}
          </button>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Vous avez déjà un compte ?
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#10b981',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #10b981',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#10b981';
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
