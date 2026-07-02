import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, LogIn, Eye, EyeOff, Package, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
import InvenSyncLogo from '../components/InvenSyncLogo.jsx';
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>

      {/* ── LEFT: Login Form ── */}
      <div style={{
        flex: '0 0 44%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        position: 'relative',
        zIndex: 2,
      }}>
        <div className="auth-v2-card" style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
          <div className="auth-v2-logo">
            <InvenSyncLogo size={44} className="logo-icon" />
            <span className="logo-text" style={{ fontSize: '1.8rem' }}>InvenSync</span>
          </div>

          <h1 className="auth-v2-title" style={{ fontSize: '1.6rem' }}>Welcome Back</h1>
          <p className="auth-v2-subtitle">Sign in to your workspace</p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', color: 'var(--danger)',
              padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem',
              fontSize: '0.875rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.2)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-v2-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={17} />
                <input required type="email" className="form-input"
                  placeholder="name@company.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={17} />
                <input required type={showPassword ? 'text' : 'password'}
                  className="form-input with-password-toggle"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary full-width"
              style={{ marginTop: '0.5rem', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '12px', fontSize: '1rem' }}>
              {loading ? 'Signing in…' : <><LogIn size={19} /> Sign In</>}
            </button>
          </form>

          <div className="auth-v2-footer">
            Don't have an account?
            <Link to="/signup" className="auth-v2-link">Create one</Link>
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
