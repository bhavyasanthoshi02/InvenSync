import React, { useState, useEffect, useContext } from 'react';
import { User, Bell, Palette } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Settings() {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('workspace-theme') || 'slate');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSaving(true);

    if (!name.trim() || !email.trim()) {
      setStatus({ type: 'error', message: 'Name and Email are required' });
      setIsSaving(false);
      return;
    }

    const res = await updateUser({ name, email });
    setIsSaving(false);
    if (res.success) {
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  const applyTheme = (newTheme) => {
    document.body.classList.remove('theme-slate', 'theme-emerald', 'theme-rosegold', 'theme-royalblue');
    if (newTheme !== 'slate') {
      document.body.classList.add(`theme-${newTheme}`);
    }
    localStorage.setItem('workspace-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="dashboard-content">
      <div className="panel full-width">
        <h2 className="panel-title" style={{ marginBottom: '1.5rem' }}>System Settings</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Profile Section */}
          <div className="settings-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <User size={18} color="var(--accent)" /> Profile Settings
            </h3>
            
            {status.message && (
              <div style={{
                background: status.type === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(255,74,74,0.1)',
                color: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                textAlign: 'center',
                border: status.type === 'success' ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(255,74,74,0.2)'
              }}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Full Name</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Email Address</label>
                  <input 
                    className="form-input" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="btn btn-primary">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Theme Personalization Section */}
          <div className="settings-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <Palette size={18} color="var(--accent)" /> Workspace Theme
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              Select a color palette to personalize the UI layout in real-time.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { id: 'slate', name: 'Default Slate', color: '#ffd60a' },
                { id: 'emerald', name: 'Emerald Forest', color: '#10b981' },
                { id: 'rosegold', name: 'Rose Gold', color: '#e5a698' },
                { id: 'royalblue', name: 'Royal Blue', color: '#4169e1' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => applyTheme(t.id)}
                  type="button"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: theme === t.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: t.color }}></div>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <Bell size={18} color="var(--accent)" /> Notification Preferences
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                <span>Email alerts for low stock levels</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                <span>Daily summary reports</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                <span>New order push notifications</span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
