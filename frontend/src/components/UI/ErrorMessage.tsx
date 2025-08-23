import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry
}) => {
  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      padding: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ flexShrink: 0 }}>
          <svg width="20" height="20" fill="#f87171" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#991b1b',
            marginBottom: '0.5rem'
          }}>
            Une erreur s'est produite
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#b91c1c',
            lineHeight: '1.5',
            marginBottom: onRetry ? '1rem' : 0
          }}>
            {message}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: '1px solid #fecaca',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
