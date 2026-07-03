import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { API_BASE } from '../config';
import { MapPin, Box, Trash2, Save, Navigation } from 'lucide-react';
import StatusModal from '../components/StatusModal.jsx';

export default function ShelfPlanner() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success', title: '' });
  const [activePath, setActivePath] = useState([]);
  
  const { token } = useContext(AuthContext);

  const aisles = ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4'];
  const shelves = ['Shelf A', 'Shelf B', 'Shelf C'];

  const showStatus = (message, type = 'success', title = '') => {
    setModal({ isOpen: true, message, type, title });
  };

  const calculateRoute = (targetLocation) => {
    if (!targetLocation) {
      setActivePath([]);
      return;
    }
    const aisleMatch = targetLocation.match(/Aisle (\d+)/);
    const shelfMatch = targetLocation.match(/Shelf ([A-C])/);
    if (!aisleMatch || !shelfMatch) {
      setActivePath([]);
      return;
    }

    const targetX = parseInt(aisleMatch[1]) - 1; 
    const targetY = shelfMatch[1].charCodeAt(0) - 65; 

    const startX = 0;
    const startY = 0;

    const queue = [[startX, startY, []]];
    const visited = new Set();
    visited.add(`0,0`);

    while (queue.length > 0) {
      const [cx, cy, path] = queue.shift();
      const currentPath = [...path, `${cx},${cy}`];

      if (cx === targetX && cy === targetY) {
        setActivePath(currentPath);
        return;
      }

      const neighbors = [];
      if (cy > 0) neighbors.push([cx, cy - 1]);
      if (cy < 2) neighbors.push([cx, cy + 1]);
      
      if (cy === 0 || cy === 2) {
        if (cx > 0) neighbors.push([cx - 1, cy]);
        if (cx < 3) neighbors.push([cx + 1, cy]);
      }

      for (const [nx, ny] of neighbors) {
        const key = `${nx},${ny}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([nx, ny, currentPath]);
        }
      }
    }
    setActivePath([]);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products?limit=100`, {
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
    if (token) fetchProducts();
  }, [token]);

  const handleAssignShelf = async (productId, location) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ shelfLocation: location })
      });
      const data = await res.json();
      if (data.success) {
        showStatus(`Product successfully assigned to ${location}`, 'success', 'Assigned');
        fetchProducts();
        setSelectedProduct(null);
        setActivePath([]);
      } else {
        showStatus(data.message, 'error', 'Error');
      }
    } catch (err) {
      showStatus('Failed to assign shelf location', 'error', 'Error');
    }
  };

  const handleClearShelf = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ shelfLocation: '' })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('Shelf location cleared', 'success', 'Cleared');
        fetchProducts();
        setActivePath([]);
      } else {
        showStatus(data.message, 'error', 'Error');
      }
    } catch (err) {
      showStatus('Failed to clear shelf location', 'error', 'Error');
    }
  };

  // Group products by shelf location for rendering inside grid
  const getProductsAtLocation = (location) => {
    return products.filter(p => p.shelfLocation === location);
  };

  return (
    <div className="dashboard-content">
      <div className="shelf-planner-container">
        
        {/* LEFT: Warehouse Visual Grid */}
        <div className="panel" style={{ minHeight: '500px' }}>
          <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <MapPin size={22} color="var(--accent)" /> Visual Shelf Planner
              </h2>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '2px solid var(--success)', background: 'rgba(52, 211, 153, 0.1)' }}></span>
                  Optimal Picker Route (BFS)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '1px dashed var(--accent)' }}></span>
                  Placement Target
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>
              {selectedProduct 
                ? selectedProduct.shelfLocation
                  ? `Showing optimal path from entrance to "${selectedProduct.name}" at ${selectedProduct.shelfLocation}. Click another cell to reassign.`
                  : `Click any shelf cell to assign "${selectedProduct.name}".` 
                : 'Select a product from the list on the right to view its optimal walking route or assign it to a shelf.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {aisles.map(aisle => (
              <div key={aisle} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', background: 'var(--bg-secondary)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {aisle}
                </h4>
                
                <div className="shelves-grid">
                  {shelves.map(shelf => {
                    const locationString = `${aisle} - ${shelf}`;
                    const items = getProductsAtLocation(locationString);
                    const isOver = selectedProduct !== null;
                    const x = aisles.indexOf(aisle);
                    const y = shelves.indexOf(shelf);
                    const coordinateString = `${x},${y}`;
                    const pathStepIndex = activePath.indexOf(coordinateString);
                    const isInPath = pathStepIndex !== -1;

                    return (
                      <div 
                        key={shelf}
                        onClick={() => selectedProduct && handleAssignShelf(selectedProduct._id, locationString)}
                        style={{
                          background: 'var(--bg-panel)',
                          border: isInPath ? '2px solid var(--success)' : isOver ? '1px dashed var(--accent)' : '1px solid var(--border)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          minHeight: '110px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          cursor: isOver ? 'pointer' : 'default',
                          transition: 'all 0.2s ease',
                          boxShadow: isInPath ? '0 0 10px rgba(52, 211, 153, 0.25)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (isOver && !isInPath) e.currentTarget.style.borderColor = 'var(--accent)';
                        }}
                        onMouseLeave={(e) => {
                          if (isOver && !isInPath) e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {shelf}
                            {isInPath && (
                              <span style={{ fontSize: '0.55rem', padding: '1px 4px', borderRadius: '4px', background: 'var(--success)', color: 'var(--text-inverted)', fontWeight: 700 }}>
                                #{pathStepIndex + 1}
                              </span>
                            )}
                          </span>
                          <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                            {items.length} Items
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
                          {items.map(item => (
                            <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px', fontWeight: 500 }}>
                                {item.name}
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearShelf(item._id);
                                }}
                                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                title="Remove from shelf"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          {items.length === 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'rgba(255,255,255,0.1)', fontSize: '0.7rem' }}>
                              Empty
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Drawer/List */}
        <div className="panel" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={18} color="var(--accent)" /> Product Selector
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Select a product from below, then click any shelf in the layout to assign it.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {products.map(p => {
              const isSelected = selectedProduct?._id === p._id;
              const handleProductSelect = () => {
                if (isSelected) {
                  setSelectedProduct(null);
                  setActivePath([]);
                } else {
                  setSelectedProduct(p);
                  calculateRoute(p.shelfLocation);
                }
              };

              return (
                <div 
                  key={p._id}
                  onClick={handleProductSelect}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: isSelected ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {p.quantity} Units
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    <span>{p.category}</span>
                    <span style={{ fontStyle: p.shelfLocation ? 'normal' : 'italic', color: p.shelfLocation ? 'var(--success)' : 'var(--text-secondary)' }}>
                      {p.shelfLocation || 'Unassigned'}
                    </span>
                  </div>
                </div>
              );
            })}
            {products.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0', fontSize: '0.8rem' }}>
                No products found. Add products to inventory first.
              </div>
            )}
          </div>
        </div>

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
