import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

interface AvailabilityEntry { date: string; times: string[] }

const DoctorProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    first_name: '', last_name: '', email: '', password: '',
    phone: '', address: '', city: '', state: '', zip_code: '', bio: '', consultation_fee: ''
  });
  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [showAvailModal, setShowAvailModal] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const me = await doctorService.getMe();
        setForm({
          first_name: me.user.first_name || '',
          last_name: me.user.last_name || '',
          email: me.user.email || '',
          password: '',
          phone: me.doctor.phone || '',
          address: me.doctor.address || '',
          city: me.doctor.city || '',
          state: me.doctor.state || '',
          zip_code: me.doctor.zip_code || '',
          bio: me.doctor.bio || '',
          consultation_fee: me.doctor.consultation_fee || ''
        });
        // Transform backend dict availability to list for UI
        const av = me.doctor.availability || {};
        const entries: AvailabilityEntry[] = Object.keys(av).map((d: string) => ({ date: d, times: Array.isArray(av[d]) ? av[d] : [] }));
        setAvailability(entries);
        // Initialize JSON editor from availability
        try {
          const asObject: any = entries.reduce((acc: any, cur) => { acc[cur.date] = cur.times; return acc; }, {});
          setJsonText(JSON.stringify(asObject, null, 2));
        } catch {}
      } catch (e) {
        toast.error('Erreur lors du chargement du profil médecin');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };

  const addTime = () => {
    if (!newDate || !newTime) return;
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form, availability };
      if (!payload.password) delete payload.password; // don't send empty password
      await doctorService.updateMe(payload);
      toast.success('Profil médecin mis à jour');
    } catch (e) {
      // handled by interceptor
    }
  };

  if (loading) return <div style={{padding:'2rem'}}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Mon Profil (Médecin)</h1>
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
          onMouseOver={(e)=> e.currentTarget.style.background = '#f8fafc'}
          onMouseOut={(e)=> e.currentTarget.style.background = 'white'}
        >
          ← Retour
        </button>
      </div>
      <form onSubmit={onSubmit} style={{ background: 'white', padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label>Prénom</label>
            <input name="first_name" value={form.first_name} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label>Nom</label>
            <input name="last_name" value={form.last_name} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label>Nouveau mot de passe (optionnel)</label>
            <input type="password" name="password" value={form.password} onChange={onChange} placeholder="Laisser vide pour ne pas changer" style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label>Téléphone</label>
            <input name="phone" value={form.phone} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label>Adresse</label>
            <input name="address" value={form.address} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label>Ville</label>
            <input name="city" value={form.city} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label>Région</label>
            <input name="state" value={form.state} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div>
            <label>Code postal</label>
            <input name="zip_code" value={form.zip_code} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Bio</label>
            <textarea name="bio" value={form.bio} onChange={onChange} rows={4} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem', resize: 'vertical' }} />
          </div>
          <div>
            <label>Tarif consultation (€)</label>
            <input name="consultation_fee" value={form.consultation_fee} onChange={onChange} style={{ width: '100%', padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }} />
          </div>
        </div>

        {/* Disponibilités - bouton pour ouvrir le popup */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '.5rem' }}>Disponibilités</h2>
          {/* Bouton supprimé selon demande */}
        </div>

        {/* Modal de gestion des disponibilités */}
        {showAvailModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ width: 'min(900px, 92vw)', background: 'white', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.1rem' }}>Disponibilités du médecin</strong>
                <button type="button" onClick={() => setShowAvailModal(false)} style={{ background: 'transparent', border: 0, fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem' }}>
                {/* Colonne 1: Sélection date/heure */}
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

                  <div style={{ display: 'grid', gap: '.75rem', maxHeight: '50vh', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '.5rem', padding: '.5rem' }}>
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
                </div>

                {/* Colonne 2: JSON editor/preview */}
                <div>
                  <div style={{ marginBottom: '.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontWeight: 700 }}>JSON des disponibilités</label>
                    <button type="button" onClick={() => {
                      try {
                        // Try parse and load to state
                        const obj = JSON.parse(jsonText || '{}');
                        const entries: AvailabilityEntry[] = Object.keys(obj).map((d: string) => ({ date: d, times: Array.isArray(obj[d]) ? obj[d] : [] }));
                        setAvailability(entries.sort((a,b)=>a.date.localeCompare(b.date)));
                        setJsonError(null);
                        toast.success('JSON chargé dans les disponibilités');
                      } catch (err:any) {
                        setJsonError('JSON invalide');
                      }
                    }} style={{ background: '#0ea5e9', color: 'white', border: 0, padding: '.4rem .7rem', borderRadius: '.4rem', fontWeight: 600 }}>Charger JSON</button>
                  </div>
                  <textarea value={jsonText} onChange={(e)=>{ setJsonText(e.target.value); setJsonError(null); }} rows={18} style={{ width: '100%', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', border: '1px solid #e5e7eb', borderRadius: '.5rem', padding: '.6rem' }} />
                  {jsonError && <div style={{ color: '#ef4444', marginTop: '.5rem' }}>{jsonError}</div>}
                  <div style={{ marginTop: '.5rem', fontSize: '.875rem', color: '#475569' }}>
                    Exemple: {`{`}"2025-08-25": ["09:00", "10:30"], "2025-08-26": ["14:00"]{`}`}
                  </div>
                  <div style={{ marginTop: '.75rem', display: 'flex', gap: '.5rem' }}>
                    <button type="button" onClick={() => {
                      // Sync from availability to JSON
                      const asObject: any = availability.reduce((acc: any, cur) => { acc[cur.date] = cur.times; return acc; }, {});
                      setJsonText(JSON.stringify(asObject, null, 2));
                      toast.success('JSON mis à jour depuis la liste');
                    }} style={{ background: '#22c55e', color: 'white', border: 0, padding: '.45rem .7rem', borderRadius: '.4rem', fontWeight: 600 }}>Mettre à jour JSON</button>
                    <button type="button" onClick={() => setShowAvailModal(false)} style={{ background: '#64748b', color: 'white', border: 0, padding: '.45rem .7rem', borderRadius: '.4rem', fontWeight: 600 }}>Fermer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" style={{ background: '#2563eb', color: 'white', padding: '.75rem 1.25rem', border: 0, borderRadius: '.5rem', fontWeight: 600 }}>Enregistrer</button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfilePage;