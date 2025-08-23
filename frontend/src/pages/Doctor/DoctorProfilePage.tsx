import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

const DoctorProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    first_name: '', last_name: '', email: '', password: '',
    phone: '', address: '', city: '', state: '', zip_code: '', bio: '', consultation_fee: ''
  });

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form };
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
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Mon Profil (Médecin)</h1>
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
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" style={{ background: '#2563eb', color: 'white', padding: '.75rem 1.25rem', border: 0, borderRadius: '.5rem', fontWeight: 600 }}>Enregistrer</button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfilePage;