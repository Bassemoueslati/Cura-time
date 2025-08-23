import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiService } from '../../services/apiService';

interface ResetForm {
  email: string;
  code: string;
  new_password: string;
}

const ResetPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const presetEmail = params.get('email') || '';
  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    defaultValues: { email: presetEmail }
  });

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true);
    try {
      await apiService.post('/client/verify-code/', data);
      toast.success('Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation:', error);
      const msg = error?.response?.data?.error || error?.response?.data?.detail || 'Erreur lors de la réinitialisation';
      toast.error(msg);
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
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fae8ff 100%)',
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 15px -3px rgba(236, 72, 153, 0.3)'
          }}>
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
            Réinitialiser le mot de passe
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Saisissez le code reçu par email et votre nouveau mot de passe (patients uniquement)
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Email</label>
            <input
              {...register('email', { required: 'L\'email est requis' })}
              type="email"
              placeholder="votre@email.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem' }}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Code de vérification</label>
            <input
              {...register('code', { required: 'Le code est requis' })}
              type="text"
              placeholder="1234"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem' }}
            />
            {errors.code && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.code.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Nouveau mot de passe</label>
            <input
              {...register('new_password', { required: 'Le mot de passe est requis', minLength: { value: 6, message: 'Au moins 6 caractères' } })}
              type="password"
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem' }}
            />
            {errors.new_password && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.new_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.9rem 1.2rem',
              background: isLoading ? '#9ca3af' : '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? 'Réinitialisation...' : 'Valider'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;