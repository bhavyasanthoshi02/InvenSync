import React, { useState, useEffect, useContext } from 'react';
import { Mail, Phone, Plus, X, Trash2, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { token, user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    contact: '', 
    email: '', 
    phone: '', 
    rating: 5.0 
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/suppliers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSuppliers();
  }, [token]);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/suppliers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ...formData, createdBy: user.email })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({ name: '', contact: '', email: '', phone: '', rating: 5.0 });
        fetchSuppliers(); 
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error adding supplier');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/suppliers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchSuppliers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to delete supplier');
    }
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="panel-title" style={{ fontSize: '1.5rem' }}>Suppliers</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage relationships and contact information.</p>
        </div>
        
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Add Supplier
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>Loading suppliers...</div>
      ) : suppliers.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No suppliers found.</div>
      ) : (
        <div className="suppliers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {suppliers.map(supplier => (
            <div key={supplier._id} className="panel supplier-card" style={{ padding: '1.5rem', position: 'relative' }}>
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(supplier._id)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}
                >
                  <Trash2 size={18} />
                </button>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--nav-hover-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, border: '1px solid var(--border)' }}>
                  {supplier.name.charAt(0)}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border)' }}>
                  ⭐ {supplier.rating.toFixed(1)}
                </div>
              </div>
              
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 700 }}>{supplier.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <User size={14} /> {supplier.contact}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '2px dashed var(--border)', paddingTop: '1.5rem' }}>
                <a href={`mailto:${supplier.email}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="supplier-link">
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={16} color="var(--text-secondary)" />
                  </div>
                  {supplier.email}
                </a>
                <a href={`tel:${supplier.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="supplier-link">
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={16} color="var(--text-secondary)" />
                  </div>
                  {supplier.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Supplier Modal - Receipt Style */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--backdrop)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="auth-v2-card" style={{ maxWidth: '340px', width: '100%', padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-panel)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', position: 'relative', border: '1px solid var(--border)', margin: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--nav-hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <Plus size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Add Supplier</h3>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0, opacity: 0.7 }}>Partnership Management</p>
            </div>

            <form onSubmit={handleAddSupplier} className="auth-v2-form" style={{ gap: '0.75rem' }}>
              <div style={{ borderTop: '2px dashed var(--border)', borderBottom: '2px dashed var(--border)', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Company Name</label>
                  <input required type="text" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} placeholder="e.g. Nexus Corp" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Contact Person</label>
                  <input required type="text" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} placeholder="e.g. John Doe" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Email Address</label>
                  <input required type="email" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} placeholder="e.g. john@nexus.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone</label>
                    <input required type="text" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Rating</label>
                    <input required type="number" min="0" max="5" step="0.1" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={formData.rating} onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary full-width" style={{ borderRadius: '12px', height: '40px', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Register Supplier
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.25rem', opacity: 0.6 }}>
                 InvenSync Supplier Network 💜
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
