import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, Search, Filter, Package, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import StatusModal from '../components/StatusModal.jsx';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success', title: '' });
  
  const { token, user } = useContext(AuthContext);

  const showStatus = (message, type = 'success', title = '') => {
    setModal({ isOpen: true, message, type, title });
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Users can see ALL products, but we only show those with quantity > 0
        setProducts(data.data.products.filter(p => p.quantity > 0)); 
      }
    } catch (err) {
      console.error('Failed to fetch catalog', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const updateCart = (productId, delta, max, absolute = false) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      let next;
      if (absolute) {
        next = Math.max(0, Math.min(max, delta));
      } else {
        next = Math.max(0, Math.min(max, current + delta));
      }

      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  };

  const placeOrder = async () => {
    const orderItems = Object.entries(cart).map(([productId, quantity]) => ({
      product: productId,
      quantity
    }));

    if (orderItems.length === 0) {
      return showStatus('Your cart is empty', 'warning', 'Empty Cart');
    }

    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          products: orderItems
        })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('Your order has been placed successfully! The relevant admins will review it soon.', 'success', 'Order Placed');
        setCart({});
        fetchProducts(); 
      } else {
        showStatus(data.message, 'error', 'Order Failed');
      }
    } catch (err) {
      showStatus('Something went wrong while placing your order. Please try again.', 'error', 'Error');
    }
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="panel-title" style={{ fontSize: '1.5rem' }}>Product Catalog</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Browse available items and place your order.</p>
        </div>
        
        {totalItems > 0 && (
          <button onClick={placeOrder} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem' }}>
            <ShoppingCart size={20} /> Place Order ({totalItems} items)
          </button>
        )}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>Loading catalog...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1', background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No items available at the moment.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product._id} className="stat-card" style={{ flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="stat-icon" style={{ width: '48px', height: '48px' }}>
                    <Package size={20} color="var(--accent)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{product.category}</span>
                       <span style={{ fontSize: '0.8rem', opacity: 0.3 }}>•</span>
                       <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500 }}>by {product.createdBy}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent)' }}>₹{product.price}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>In Stock:</span>
                  <span style={{ marginLeft: '8px', fontWeight: 600 }}>{product.quantity} units</span>
                </div>
                <div className={`status-badge ${product.quantity < 10 ? 'low-stock' : 'in-stock'}`} style={{ fontSize: '0.7rem' }}>
                   {product.quantity < 10 ? 'LIMITED' : 'AVAILABLE'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <button 
                    onClick={() => updateCart(product._id, -1, product.quantity)}
                    style={{ flex: 1, height: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRight: '1px solid var(--border)' }}
                  >-</button>
                  <input 
                    type="number"
                    value={cart[product._id] || 0}
                    onChange={(e) => updateCart(product._id, parseInt(e.target.value) || 0, product.quantity, true)}
                    style={{ flex: 2, textAlign: 'center', fontWeight: 600, background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', appearance: 'textfield' }}
                  />
                  <button 
                    onClick={() => updateCart(product._id, 1, product.quantity)}
                    style={{ flex: 1, height: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderLeft: '1px solid var(--border)' }}
                  >+</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
