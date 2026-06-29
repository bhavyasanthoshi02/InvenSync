import React from 'react';
import { User, Bell, Shield, Database } from 'lucide-react';

export default function Settings() {
  return (
    <div className="dashboard-content">
      <div className="panel full-width">
        <h2 className="panel-title" style={{ marginBottom: '1.5rem' }}>System Settings</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          <div className="settings-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <User size={18} color="var(--accent)" /> Profile Settings
            </h3>
            <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" defaultValue="Admin User" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" defaultValue="admin@invensync.com" />
              </div>
            </div>
            <button className="btn btn-primary">Save Changes</button>
          </div>

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
