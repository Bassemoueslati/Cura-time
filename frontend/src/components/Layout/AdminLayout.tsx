import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8fafc' }}>
      {/* Admin Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <nav style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4.5rem'
          }}>
            {/* Logo Admin */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/admin/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none'
              }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)'
                }}>
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: '#1e293b',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    CuraTime Admin
                  </span>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: '500',
                    marginTop: '-2px'
                  }}>
                    Panneau d'administration
                  </div>
                </div>
              </Link>
            </div>

            {/* Admin User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db'
                  }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: '#7c3aed',
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
                        A
                      </span>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        fontWeight: '600'
                      }}>
                        Admin System
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        Administrateur
                      </div>
                    </div>
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
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
