import React, { useState, useEffect, useContext } from 'react';
import { default as ImageIcon } from 'lucide-react/dist/esm/icons/image';
import { Trash2, Filter, Plus, X, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router';
import StatusModal from '../components/StatusModal.jsx';
import { API_BASE } from '../config';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success', title: '' });
  
  const { token, user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  const showStatus = (message, type = 'success', title = '') => {
    setModal({ isOpen: true, message, type, title });
  };

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    category: '', 
    quantity: '', 
    price: '', 
    status: 'In Stock' 
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) fetchProducts();
  }, [token, isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity) || 0,
          price: parseFloat(formData.price) || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({ name: '', category: '', quantity: '', price: '', status: 'In Stock' });
        showStatus('Product added to your catalog successfully!', 'success', 'Added');
        fetchProducts(); 
      } else {
        showStatus(data.message, 'error', 'Error');
      }
    } catch (err) {
      showStatus('Error creating product', 'error', 'Error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showStatus('Product removed from inventory', 'success', 'Deleted');
        fetchProducts();
      } else {
        showStatus(data.message, 'error', 'Error');
      }
    } catch (err) {
      showStatus('Failed to execute delete', 'error', 'Error');
    }
  };

  const getBadgeClass = (status) => {
    if (status === 'Out of Stock') return 'out-of-stock';
    if (status === 'Low Stock') return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="dashboard-content" style={{ position: 'relative' }}>
      <div className="panel full-width">
        <div className="panel-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 className="panel-title">Inventory Management</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Managing products for <strong>{user?.name}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Add New Product
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Loading inventory...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
             You haven't listed any products yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Count</th>
                  <th>Status Depiction</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-img">
                          <ImageIcon size={18} />
                        </div>
                        <span className="product-name">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td style={{ fontWeight: 600 }}>{product.quantity}</td>
                    <td>
                      <span className={`status-badge ${getBadgeClass(product.status)}`}>
                        {product.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(product._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal - Receipt Style */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--backdrop)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="auth-v2-card" style={{ maxWidth: '340px', width: '100%', padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-panel)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', position: 'relative', border: '1px solid var(--border)', margin: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--nav-hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <Plus size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Product</h3>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0, opacity: 0.7 }}>Listed by {user?.name}</p>
            </div>

            <form onSubmit={handleAddProduct} className="auth-v2-form" style={{ gap: '0.75rem' }}>
              <div style={{ borderTop: '2px dashed var(--border)', borderBottom: '2px dashed var(--border)', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Product Name</label>
                  <input required type="text" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} placeholder="e.g. Laptop Pro" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Category</label>
                  <input required type="text" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} placeholder="e.g. Electronics" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Qty</label>
                    <input required type="number" min="0" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Price (₹)</label>
                    <input required type="number" min="0" step="0.01" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Initial Status</label>
                  <select className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', appearance: 'none' }} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary full-width" style={{ borderRadius: '12px', height: '40px', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Add to Inventory
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.25rem', opacity: 0.6 }}>
                 InvenSync Management Solution 💜
              </p>
            </form>
          </div>
        </div>
      )}

      <StatusModal 
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        title={modal.title}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
}
