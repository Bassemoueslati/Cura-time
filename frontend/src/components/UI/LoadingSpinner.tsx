import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#3b82f6'
}) => {
  const sizes = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' }
  };

  const spinnerStyle = {
    ...sizes[size],
    border: '2px solid transparent',
    borderTop: `2px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </>
  );
};

export default LoadingSpinner;
