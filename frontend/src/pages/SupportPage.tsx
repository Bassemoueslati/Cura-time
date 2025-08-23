import React, { useState } from 'react';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const SupportPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Veuillez décrire votre problème ou suggestion.');
      return;
    }
    try {
      setLoading(true);
      await apiService.post('/support/contact/', { subject, category, message, email });
      toast.success('Merci ! Votre message a été envoyé au support.');
      setSubject(''); setCategory('bug'); setMessage(''); setEmail('');
    } catch (err) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Support & Suggestions</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Signalez un problème ou proposez une amélioration. Nous répondons rapidement.
      </p>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.25rem' }}>Sujet</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Sujet (optionnel)"
              style={{ width: '100%', padding: '.75rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.25rem' }}>Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '.75rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }}>
              <option value="bug">Bug</option>
              <option value="suggestion">Suggestion</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.25rem' }}>Votre email (optionnel)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com"
              style={{ width: '100%', padding: '.75rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.25rem' }}>Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Décrivez le problème ou votre idée"
              style={{ width: '100%', padding: '.75rem', border: '1px solid #d1d5db', borderRadius: '.5rem', resize: 'vertical' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ padding: '.75rem 1.5rem', backgroundColor: loading ? '#9ca3af' : '#2563eb', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Envoi...' : 'Envoyer au support'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportPage;