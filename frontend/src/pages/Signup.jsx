import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { Box, Mail, Lock, User, UserPlus, Shield, Users, Eye, EyeOff, Package, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

const features = [
  { icon: Package, title: 'Smart Inventory', desc: 'Real-time stock tracking across all categories' },
  { icon: BarChart3, title: 'Live Analytics', desc: 'Revenue trends and performance insights' },
  { icon: Users, title: 'Role-Based Access', desc: 'Admins & users with tailored experiences' },
  { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'JWT-auth protected with encrypted data' },
];

const stats = [
  { value: '10K+', label: 'Products Tracked' },
  { value: '98%', label: 'Uptime' },
  { value: '500+', label: 'Orders Daily' },
];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Users' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await register(formData);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>

      {/* ── LEFT: Signup Form ── */}
      <div style={{
        flex: '0 0 44%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 2.5rem',
        position: 'relative',
        zIndex: 2,
        overflowY: 'auto'
      }}>
        <div className="auth-v2-card auth-signup-card" style={{ width: '100%', maxWidth: '440px', position: 'relative', margin: 'auto' }}>
          <div className="auth-v2-logo" style={{ marginBottom: '0.75rem', transform: 'scale(0.95)' }}>
            <Box className="logo-icon" size={40} />
            <span className="logo-text" style={{ fontSize: '1.6rem' }}>InvenSync</span>
          </div>

          <h1 className="auth-v2-title" style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Create Account</h1>
          <p className="auth-v2-subtitle" style={{ marginBottom: '0.75rem' }}>Get started with InvenSync today</p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', color: 'var(--danger)',
              padding: '0.6rem', borderRadius: '8px', marginBottom: '0.75rem',
              fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.2)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-v2-form" style={{ gap: '0.75rem' }}>
            <div className="form-group" style={{ gap: '0.25rem' }}>
              <label className="form-label">Are you an Admin or User?</label>
              <div className="role-selector">
                <div 
                  className={`role-option ${formData.role === 'Admin' ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, role: 'Admin'})}
                  style={{ padding: '0.5rem' }}
                >
                  <Shield size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Admin</span>
                </div>
                <div 
                  className={`role-option ${formData.role === 'Users' ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, role: 'Users'})}
                  style={{ padding: '0.5rem' }}
                >
                  <Users size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>User</span>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ gap: '0.25rem' }}>
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={17} />
                <input 
                  required 
                  type="text" 
                  className="form-input" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ padding: '0.65rem 1rem 0.65rem 2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ gap: '0.25rem' }}>
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={17} />
                <input 
                  required 
                  type="email" 
                  className="form-input" 
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ padding: '0.65rem 1rem 0.65rem 2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ gap: '0.25rem' }}>
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={17} />
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  className="form-input with-password-toggle" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ padding: '0.65rem 2.5rem 0.65rem 2.5rem' }}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary full-width" style={{ marginTop: '0.5rem', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '12px', fontSize: '0.95rem' }}>
              {loading ? 'Creating Account...' : (
                <>
                  <UserPlus size={18} /> Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-v2-footer" style={{ marginTop: '1rem' }}>
            Already have an account? <Link to="/login" className="auth-v2-link">Sign in instead</Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Showcase Panel ── */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        gap: '2.5rem',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
      }}>
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '480px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '1.25rem',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)',
          }}>
            <Zap size={13} /> Inventory Management Platform
          </div>

          <h2 style={{
            fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.15,
            color: 'var(--text-primary)', marginBottom: '1rem',
          }}>
            Manage smarter.<br />
            <span style={{ color: 'var(--accent)' }}>Grow faster.</span>
          </h2>

          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem'
          }}>
            From stock tracking to order fulfillment — InvenSync gives your team the tools to operate at peak efficiency.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '1rem 1.5rem',
                textAlign: 'center', minWidth: '100px',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem',
          width: '100%', maxWidth: '480px',
        }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '16px', padding: '1rem 1.1rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={16} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{f.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom branding */}
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: 0, right: 0,
          textAlign: 'center', color: 'var(--text-secondary)',
          fontSize: '0.72rem', fontWeight: 500, zIndex: 2,
          letterSpacing: '0.5px',
        }}>
          © 2026 InvenSync · Built for modern teams
        </div>
      </div>
    </div>
  );
}
