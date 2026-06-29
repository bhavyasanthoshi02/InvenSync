import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function StatusModal({ isOpen, message, type = 'success', onClose, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={48} color="var(--success)" />;
      case 'error': return <XCircle size={48} color="var(--danger)" />;
      case 'warning': return <AlertTriangle size={48} color="var(--warning)" />;
      default: return <Info size={48} color="var(--accent)" />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--danger)';
      case 'warning': return 'var(--warning)';
      default: return 'var(--accent)';
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--backdrop)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '1rem' }}>
      <div className="auth-v2-card" style={{ maxWidth: '360px', width: '100%', padding: '2rem', borderRadius: '24px', background: 'var(--bg-panel)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', position: 'relative', border: '1px solid var(--border)', textAlign: 'center', animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', opacity: 0.5 }}><X size={20} /></button>

        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: `${getAccentColor()}15`, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getIcon()}
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title || (type === 'success' ? 'Success!' : 'Notice')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>{message}</p>

        <button onClick={onClose} className="btn btn-primary full-width" style={{ height: '48px', borderRadius: '14px', fontWeight: 700, fontSize: '1rem', background: getAccentColor() }}>
          Dismiss
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}
