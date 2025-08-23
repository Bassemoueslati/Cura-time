import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '8rem 1rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2rem',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            backdropFilter: 'blur(10px)'
          }}>
            ✨ Plateforme de santé nouvelle génération
          </div>

          <h1 style={{
            fontSize: window.innerWidth > 768 ? '4rem' : '2.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.1',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Votre santé,<br />notre priorité
          </h1>

          <p style={{
            fontSize: '1.375rem',
            marginBottom: '3rem',
            opacity: 0.95,
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Prenez rendez-vous avec des spécialistes médicaux en toute simplicité
            grâce à notre plateforme moderne, intuitive et sécurisée.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <Link
              to="/register"
              style={{
                background: 'white',
                color: '#4c1d95',
                padding: '1rem 2.5rem',
                borderRadius: '0.75rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.125rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
              }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Créer un compte
            </Link>
            <Link
              to="/doctors"
              style={{
                border: '2px solid rgba(255, 255, 255, 0.8)',
                color: 'white',
                padding: '1rem 2.5rem',
                borderRadius: '0.75rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.125rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
              </svg>
              Voir les médecins
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '0.5rem',
                color: '#fbbf24'
              }}>
                50+
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: 0.9,
                fontWeight: '500'
              }}>
                Médecins spécialisés
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '0.5rem',
                color: '#34d399'
              }}>
                1000+
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: 0.9,
                fontWeight: '500'
              }}>
                Patients satisfaits
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '0.5rem',
                color: '#f472b6'
              }}>
                24/7
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: 0.9,
                fontWeight: '500'
              }}>
                Service disponible
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Pourquoi choisir CuraTime ?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem'
          }}>
            Une plateforme moderne et sécurisée pour simplifier vos consultations médicales
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '3rem'
          }}>
            <div style={{
              textAlign: 'center',
              backgroundColor: 'white',
              padding: '2.5rem 2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{
                backgroundColor: '#3b82f6',
                width: '4rem',
                height: '4rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
              }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Réservation Simplifiée
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                Prenez rendez-vous en quelques clics avec nos spécialistes disponibles. Interface intuitive et processus rapide.
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              backgroundColor: 'white',
              padding: '2.5rem 2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{
                backgroundColor: '#10b981',
                width: '4rem',
                height: '4rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
              }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Médecins Certifiés
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                Tous nos médecins sont certifiés et expérimentés dans leur domaine de spécialisation.
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              backgroundColor: 'white',
              padding: '2.5rem 2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{
                backgroundColor: '#8b5cf6',
                width: '4rem',
                height: '4rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)'
              }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Disponible 24/7
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                Consultez les disponibilités et gérez vos rendez-vous à tout moment, où que vous soyez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                À propos de nous
              </div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '1.5rem',
                lineHeight: '1.2'
              }}>
                Une nouvelle approche de la santé digitale
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: '#64748b',
                lineHeight: '1.7',
                marginBottom: '2rem'
              }}>
                CuraTime révolutionne la prise de rendez-vous médicaux en offrant une plateforme
                intuitive qui connecte patients et professionnels de santé. Notre mission est de
                rendre les soins de santé plus accessibles et efficaces pour tous.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '🎯', title: 'Mission', desc: 'Simplifier l\'accès aux soins de santé' },
                  { icon: '👥', title: 'Communauté', desc: 'Plus de 1000 patients satisfaits' },
                  { icon: '🏆', title: 'Excellence', desc: 'Médecins certifiés et expérimentés' }
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '0.25rem'
                      }}>
                        {item.title}
                      </h4>
                      <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '2rem',
                padding: '3rem',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '6rem',
                  height: '6rem',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                }}>
                  <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                    <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '1rem'
                }}>
                  Technologie de pointe
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: '1rem',
                  lineHeight: '1.6'
                }}>
                  Notre plateforme utilise les dernières technologies pour garantir
                  une expérience utilisateur optimale et sécurisée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Prêt à prendre soin de votre santé ?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Rejoignez des milliers de patients qui font confiance à CuraTime pour leurs consultations médicales.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'white',
              color: '#1d4ed8',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
            }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Login Section */}
      <section style={{
        padding: '4rem 1rem',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            Accès Rapide
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Connectez-vous à votre espace selon votre profil
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Patient Login */}
            <Link
              to="/login"
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#dbeafe',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
                  <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '0.5rem'
              }}>
                Espace Patient
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0
              }}>
                Prenez rendez-vous et gérez vos consultations
              </p>
            </Link>

            {/* Doctor Login */}
            <Link
              to="/doctor/login"
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#0ea5e9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="24" height="24" fill="#0ea5e9" viewBox="0 0 24 24">
                  <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '0.5rem'
              }}>
                Espace Médecin
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0
              }}>
                Gérez vos patients et votre planning
              </p>
            </Link>

            {/* Admin Login */}
            <Link
              to="/admin/login"
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#7c3aed';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f3e8ff',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="24" height="24" fill="#7c3aed" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '0.5rem'
              }}>
                Espace Admin
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0
              }}>
                Administration du système
              </p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
