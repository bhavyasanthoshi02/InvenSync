import React, { useState, useEffect, useContext } from 'react';
import { default as ImageIcon } from 'lucide-react/dist/esm/icons/image';
import { Trash2, Plus, X, Camera, Download, Upload, Printer, AlertTriangle, History, QrCode } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router';
import StatusModal from '../components/StatusModal.jsx';
import { API_BASE } from '../config';
import { Html5Qrcode } from 'html5-qrcode';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success', title: '' });
  const [scanning, setScanning] = useState(false);
  
  // History Drawer State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyProduct, setHistoryProduct] = useState(null);

  // QR Generator State
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrProduct, setQrProduct] = useState(null);
  
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
    status: 'In Stock',
    shelfLocation: '',
    batchNumber: '',
    expiryDate: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
        
        // Update history drawer details if active
        if (historyProduct) {
          const freshProd = data.data.products.find(p => p._id === historyProduct._id);
          if (freshProd) setHistoryProduct(freshProd);
        }
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

  // Barcode scanner trigger
  useEffect(() => {
    let html5QrCode;
    if (scanning) {
      html5QrCode = new Html5Qrcode("reader");
      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 }
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
          setScanning(false);
        },
        (errorMessage) => {
          // Quiet scanner logs
        }
      ).catch(err => {
        console.error("Scanner start error", err);
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Scanner stop error", err));
      }
    };
  }, [scanning]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleScanSuccess = async (scannedCode) => {
    const matchedProduct = products.find(p => 
      p.name.toLowerCase() === scannedCode.toLowerCase() || 
      p.batchNumber === scannedCode || 
      p._id === scannedCode
    );

    if (matchedProduct) {
      // Auto increment stock
      try {
        const res = await fetch(`${API_BASE}/products/${matchedProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: matchedProduct.quantity + 1 })
        });
        const data = await res.json();
        if (data.success) {
          showStatus(`Scanned ${matchedProduct.name}: Stock auto-incremented to ${matchedProduct.quantity + 1}`, 'success', 'Stock Incremented');
          fetchProducts();
        } else {
          showStatus(data.message, 'error', 'Error');
        }
      } catch (err) {
        showStatus('Failed to update scanned stock', 'error', 'Error');
      }
    } else {
      setFormData({
        name: scannedCode,
        category: '',
        quantity: '1',
        price: '',
        status: 'In Stock',
        shelfLocation: '',
        batchNumber: scannedCode,
        expiryDate: ''
      });
      setShowModal(true);
      showStatus(`New item scanned. Prefilled code: "${scannedCode}"`, 'success', 'Ready to Add');
    }
  };

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
        setFormData({ name: '', category: '', quantity: '', price: '', status: 'In Stock', shelfLocation: '', batchNumber: '', expiryDate: '' });
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

  const handleRestoreVersion = async (productId, versionId) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ restoreVersionId: versionId })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('Product version restored successfully!', 'success', 'Rollback Done');
        fetchProducts();
      } else {
        showStatus(data.message, 'error', 'Error');
      }
    } catch (err) {
      showStatus('Failed to restore product state', 'error', 'Error');
    }
  };

  // CSV Operations
  const handleExportCSV = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Price', 'Status', 'Shelf Location', 'Batch Number', 'Expiry Date'];
    const rows = products.map(p => [
      p.name,
      p.category,
      p.quantity,
      p.price,
      p.status,
      p.shelfLocation || '',
      p.batchNumber || '',
      p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invensync_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const dataLines = lines.slice(1);
      
      let successCount = 0;
      let failCount = 0;

      for (const line of dataLines) {
        const parts = line.split(',').map(part => part.replace(/^"|"$/g, '').trim());
        if (parts.length < 4) continue;

        const [name, category, quantity, price, status, shelfLocation, batchNumber, expiryDate] = parts;
        try {
          const res = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              name,
              category,
              quantity: parseInt(quantity) || 0,
              price: parseFloat(price) || 0,
              status: status || 'In Stock',
              shelfLocation: shelfLocation || '',
              batchNumber: batchNumber || '',
              expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined
            })
          });
          const data = await res.json();
          if (data.success) successCount++;
          else failCount++;
        } catch (err) {
          failCount++;
        }
      }
      showStatus(`Import CSV complete. Imported: ${successCount}, Failed: ${failCount}`, 'success', 'CSV Imported');
      fetchProducts();
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const getBadgeClass = (status) => {
    if (status === 'Out of Stock') return 'out-of-stock';
    if (status === 'Low Stock') return 'low-stock';
    return 'in-stock';
  };

  const getExpiryLabel = (expiryDate) => {
    if (!expiryDate) return <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontStyle: 'italic' }}>N/A</span>;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertTriangle size={12} /> Expired
        </span>
      );
    }
    if (diffDays <= 30) {
      return (
        <span style={{ color: 'var(--warning)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertTriangle size={12} /> Expir. {diffDays}d
        </span>
      );
    }
    return <span style={{ color: 'var(--success)', fontSize: '0.75rem' }}>{expiry.toLocaleDateString()}</span>;
  };

  return (
    <div className="dashboard-content" style={{ position: 'relative' }}>
      <div className="panel full-width">
        <div className="panel-header no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="panel-title">Inventory Management</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Managing products for <strong>{user?.name}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setScanning(true)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={15} /> Scan Barcode
            </button>
            <button onClick={handleExportCSV} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={15} /> Export CSV
            </button>
            <label className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}>
              <Upload size={15} /> Import CSV
              <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
            </label>
            <button onClick={() => window.print()} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={15} /> Print Report
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={15} /> Add New Product
            </button>
          </div>
        </div>

        {/* Print Title Header */}
        <div className="only-print" style={{ display: 'none', marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>InvenSync Inventory Report</h1>
          <p style={{ fontSize: '12px', color: '#666' }}>Generated on {new Date().toLocaleString()} by {user?.name}</p>
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
                  <th>Shelf Loc.</th>
                  <th>Batch No.</th>
                  <th>Expiry Date</th>
                  <th>Price</th>
                  <th>Stock Count</th>
                  <th className="no-print">Status</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-img no-print">
                          <ImageIcon size={18} />
                        </div>
                        <span className="product-name">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.shelfLocation || <span style={{ opacity: 0.3 }}>-</span>}</td>
                    <td>{product.batchNumber || <span style={{ opacity: 0.3 }}>-</span>}</td>
                    <td>{getExpiryLabel(product.expiryDate)}</td>
                    <td>₹{product.price}</td>
                    <td style={{ fontWeight: 600 }}>{product.quantity}</td>
                    <td className="no-print">
                      <span className={`status-badge ${getBadgeClass(product.status)}`}>
                        {product.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="no-print">
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button 
                          onClick={() => { setHistoryProduct(product); setShowHistoryModal(true); }} 
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                          title="View version audit history"
                        >
                          <History size={16} />
                        </button>
                        <button 
                          onClick={() => { setQrProduct(product); setShowQrModal(true); }} 
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                          title="Generate QR Code Label"
                        >
                          <QrCode size={16} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Generator & Sticky Label Printer Modal */}
      {showQrModal && qrProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--backdrop)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 1200 }}>
          <div className="auth-v2-card" style={{ maxWidth: '360px', width: '90%', padding: '2rem', background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '24px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => { setShowQrModal(false); setQrProduct(null); }} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Product QR Code Label</h3>
            
            {/* Printable Label Container */}
            <div id="printable-label" style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', color: '#000', display: 'inline-block', margin: '0 auto 1.5rem', border: '1px solid #ddd', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700 }}>{qrProduct.name}</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>Batch: {qrProduct.batchNumber || 'N/A'}</p>
              
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrProduct._id}`} 
                alt="Product QR Code" 
                style={{ width: '160px', height: '160px', display: 'block', margin: '0 auto 8px' }}
              />
              
              <span style={{ fontSize: '0.6rem', color: '#888', display: 'block', wordBreak: 'break-all' }}>ID: {qrProduct._id}</span>
              {qrProduct.shelfLocation && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginTop: '6px', background: '#eaeaea', padding: '4px', borderRadius: '4px' }}>
                  📍 {qrProduct.shelfLocation}
                </span>
              )}
            </div>

            <button 
              onClick={() => {
                const printContents = document.getElementById('printable-label').outerHTML;
                const originalContents = document.body.innerHTML;
                document.body.innerHTML = `
                  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
                    ${printContents}
                  </div>
                `;
                window.print();
                document.body.innerHTML = originalContents;
                window.location.reload(); // Restore layout
              }}
              className="btn btn-primary full-width"
            >
              Print Sticky Label
            </button>
          </div>
        </div>
      )}

      {/* Barcode Camera Scanner Modal */}
      {scanning && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--backdrop)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 1100 }}>
          <div className="auth-v2-card" style={{ maxWidth: '400px', width: '90%', padding: '1.5rem', background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '24px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setScanning(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <h3 style={{ marginBottom: '1rem', fontWeight: 800 }}>Scan QR or Barcode</h3>
            <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Point your camera at a barcode to scan.
            </p>
          </div>
        </div>
      )}

      {/* Product Time-Travel Audit History Drawer */}
      {showHistoryModal && historyProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--backdrop)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'flex-end', zIndex: 1200 }}>
          <div style={{ width: '100%', maxWidth: '420px', height: '100%', background: 'var(--bg-panel)', borderLeft: '1px solid var(--border)', padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={20} color="var(--accent)" /> Time-Travel Audit
              </h3>
              <button onClick={() => { setShowHistoryModal(false); setHistoryProduct(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Product State</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0' }}>{historyProduct.name}</h4>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '8px', fontSize: '0.85rem' }}>
                <div>Stock: <strong style={{ color: 'var(--accent)' }}>{historyProduct.quantity} Units</strong></div>
                <div>Price: <strong>₹{historyProduct.price}</strong></div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Revision Checkpoints</h4>
              {(!historyProduct.versions || historyProduct.versions.length === 0) ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                  No historical checkpoints. Modifying product price or stock will automatically create checkpoints.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {historyProduct.versions.slice().reverse().map((version) => (
                    <div 
                      key={version._id} 
                      style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          {new Date(version.updatedAt).toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600 }}>
                          By {version.updatedBy}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.82rem' }}>
                          Stock: <strong>{version.quantity} Units</strong> | Price: <strong>₹{version.price}</strong>
                        </div>
                        <button 
                          onClick={() => handleRestoreVersion(historyProduct._id, version._id)}
                          className="btn btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '0.72rem', height: 'auto', minHeight: 'unset' }}
                        >
                          Restore State
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--backdrop)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="auth-v2-card" style={{ maxWidth: '380px', width: '100%', padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-panel)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', position: 'relative', border: '1px solid var(--border)', margin: 'auto' }}>
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

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Batch Number</label>
                    <input type="text" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} placeholder="BATCH-10" value={formData.batchNumber} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Expiry Date</label>
                    <input type="date" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Warehouse Location</label>
                  <input type="text" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} placeholder="e.g. Aisle 1 - Shelf A" value={formData.shelfLocation} onChange={(e) => setFormData({...formData, shelfLocation: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary full-width" style={{ borderRadius: '12px', height: '40px', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Add to Inventory
              </button>
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

      {/* Styled print stylesheets */}
      <style>{`
        @media print {
          .no-print, aside.sidebar, header.top-header, .panel-header, .btn, button {
            display: none !important;
          }
          .only-print {
            display: block !important;
          }
          body {
            background: #fff !important;
            color: #000 !important;
          }
          .app-container {
            display: block !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding: 0 !important;
          }
          .panel {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .inventory-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .inventory-table th {
            background: #eaeaea !important;
            color: #000 !important;
            border-bottom: 2px solid #333 !important;
            padding: 8px !important;
            text-align: left !important;
          }
          .inventory-table td {
            color: #000 !important;
            border-bottom: 1px solid #ddd !important;
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
