import React from 'react';
import Header from './Header';
import Footer from './Footer';
import bgImage from '../../assets/desktop-wallpaper-medical-doctor.jpg';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Show global header unless inside admin; prevent double header in doctor pages by keeping one consistent header */}
      <Header />
      <main className="flex-grow" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
