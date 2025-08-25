import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { toast } from 'react-toastify';

interface AvailabilityEntry { date: string; times: string[] }

const DoctorAvailabilityPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const me = await doctorService.getMe();
        const av = me.doctor?.availability || {};
        const entries: AvailabilityEntry[] = Object.keys(av).map((d: string) => ({ date: d, times: Array.isArray(av[d]) ? av[d] : [] }));
        setAvailability(entries.sort((a,b)=>a.date.localeCompare(b.date)));
      } catch (e) {
        // If unauthorized and redirected by interceptor, do nothing here
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addTime = () => {
    if (!newDate || !newTime) {
      toast.error('Sélectionnez une date et une heure');
      return;
    }
    setAvailability((prev) => {
      const idx = prev.findIndex(e => e.date === newDate);
      if (idx >= 0) {
        const exists = prev[idx].times.includes(newTime);
        if (exists) return prev;
        const updated = [...prev];
        updated[idx] = { ...updated[idx], times: [...updated[idx].times, newTime].sort() };
        return updated;
      }
      return [...prev, { date: newDate, times: [newTime] }].sort((a, b) => a.date.localeCompare(b.date));
    });
    setNewTime('');
  };

  const removeTime = (date: string, time: string) => {
    setAvailability((prev) => prev.map(e => e.date === date ? { ...e, times: e.times.filter(t => t !== time) } : e));
  };

  const removeDate = (date: string) => {
    setAvailability((prev) => prev.filter(e => e.date !== date));
  };

  const saveAvailability = async () => {
    try {
      const payload = {
        availability: availability.reduce((acc: any, cur) => { acc[cur.date] = cur.times; return acc; }, {})
      };
      await doctorService.updateMe(payload);
      toast.success('Disponibilités enregistrées');
    } catch (e) {
      // handled by interceptor / toasts
    }
  };

  if (loading) return <div style={{padding:'2rem'}}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Mes disponibilités</h1>
        <button
          type="button"
          onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = '/doctor/dashboard')}
          style={{
            padding: '.6rem .9rem',
            border: '1px solid #e5e7eb',
            borderRadius: '.5rem',
            background: 'white',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onMouseOver={(e)=> (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'}
          onMouseOut={(e)=> (e.currentTarget as HTMLButtonElement).style.background = 'white'}
        >
          ← Retour
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '.85rem' }}>Date</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ padding: '.5rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '.85rem' }}>Heure (HH:MM)</label>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ padding: '.5rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
            </div>
            <button type="button" onClick={addTime} style={{ background: '#10b981', color: 'white', padding: '.6rem .9rem', border: 0, borderRadius: '.5rem', fontWeight: 600 }}>Ajouter</button>
          </div>

          <div style={{ display: 'grid', gap: '.75rem', maxHeight: '60vh', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '.5rem', padding: '.5rem' }}>
            {availability.length === 0 && (
              <div style={{ color: '#6b7280' }}>Aucune disponibilité. Ajoutez des dates et créneaux.</div>
            )}
            {availability.map((entry) => (
              <div key={entry.date} style={{ border: '1px solid #e5e7eb', borderRadius: '.5rem', padding: '.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                  <strong>{entry.date}</strong>
                  <button type="button" onClick={() => removeDate(entry.date)} style={{ background: '#ef4444', color: 'white', border: 0, padding: '.35rem .6rem', borderRadius: '.4rem', fontWeight: 600 }}>Supprimer la date</button>
                </div>
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  {entry.times.map((t) => (
                    <span key={t} style={{ background: '#f1f5f9', padding: '.35rem .6rem', borderRadius: '.4rem', border: '1px solid #e2e8f0' }}>
                      {t}
                      <button type="button" onClick={() => removeTime(entry.date, t)} style={{ marginLeft: '.5rem', background: 'transparent', border: 0, color: '#ef4444', cursor: 'pointer' }}>×</button>
                    </span>
                  ))}
                  {entry.times.length === 0 && <span style={{ color: '#6b7280' }}>Aucun créneau pour cette date.</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '.75rem', display: 'flex', gap: '.5rem' }}>
            <button type="button" onClick={saveAvailability} style={{ background: '#2563eb', color: 'white', border: 0, padding: '.6rem .9rem', borderRadius: '.5rem', fontWeight: 700 }}>Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailabilityPage;