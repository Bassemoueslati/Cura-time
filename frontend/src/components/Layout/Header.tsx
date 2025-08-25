import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const homeTo = user?.user_role === 'doctor'
    ? '/doctor/dashboard'
    : user?.user_role === 'admin'
      ? '/admin/dashboard'
      : '/';

  const handleLogout = () => {
    logout();
    // La redirection est gérée dans la fonction logout du contexte
  };

  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '4.5rem'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to={homeTo} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none'
            }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
              }}>
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
                </svg>
              </div>
              <div>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: '#1e293b',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  CuraTime
                </span>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginTop: '-2px'
                }}>
                  Votre santé, notre priorité
                </div>
              </div>
            </Link>
          </div>

          {/* Quick nav - modern, professional buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              to={homeTo}
              style={{
                textDecoration: 'none',
                color: '#0f172a',
                fontWeight: 600,
                padding: '.5rem .85rem',
                borderRadius: '.5rem',
                border: '1px solid #e2e8f0',
                background: 'white',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              onClick={(e) => {
                // If logged in, force session-expired logout and go to public home
                if (user) {
                  e.preventDefault();
                  // clear session
                  localStorage.removeItem('token');
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  localStorage.removeItem('user');
                  localStorage.removeItem('userType');
                  localStorage.removeItem('loginResponse');
                  try { (window as any).toast?.error?.('Session expirée. Vous avez été déconnecté.'); } catch {}
                  window.location.href = '/';
                }
              }}
            >
              Accueil
            </Link>
            <Link
              to="/support"
              style={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: 700,
                padding: '.5rem .9rem',
                borderRadius: '.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #2563eb 100%)',
                boxShadow: '0 6px 12px rgba(37, 99, 235, 0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(37,99,235,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(37, 99, 235, 0.2)';
              }}
            >
              Support
            </Link>
          </div>

          {/* User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {user.first_name?.charAt(0) || user.email.charAt(0)}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    fontWeight: '500'
                  }}>
                    {user.first_name || user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                    padding: '0.6rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.25)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 18px rgba(5, 150, 105, 0.35)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.25)';
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M12 9l3-3m0 0l-3-3m3 3H8.25"/>
                  </svg>
                  Connexion
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
