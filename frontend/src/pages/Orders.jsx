import React, { useState, useEffect, useContext } from 'react';
import { Download, CheckCircle, Clock, Truck, X, XCircle, Info, Calendar, MessageSquare, Package, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import StatusModal from '../components/StatusModal.jsx';
import { API_BASE } from '../config';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminAction, setAdminAction] = useState(null); // 'accept' or 'reject'
  const [deliveryDate, setDeliveryDate] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success', title: '' });

  const { token, user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  const showStatus = (message, type = 'success', title = '') => {
    setModal({ isOpen: true, message, type, title });
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (adminAction === 'accept' && !deliveryDate) return showStatus('Please provide a delivery date', 'warning', 'Missing Data');
    
    try {
      const payload = {
        status: adminAction === 'accept' ? 'Accepted' : 'Rejected',
        deliveryDate: adminAction === 'accept' ? deliveryDate : null,
        adminMessage: adminMessage,
      };

      const res = await fetch(`${API_BASE}/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        showStatus(`Order ${adminAction === 'accept' ? 'Accepted' : 'Rejected'} successfully!`, 'success', 'Status Updated');
        setSelectedOrder(null);
        setAdminAction(null);
        setDeliveryDate('');
        setAdminMessage('');
        fetchOrders();
      } else {
        showStatus(data.message, 'error', 'Update Failed');
      }
    } catch (err) {
      showStatus('Error updating order status', 'error', 'Error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted': return <span className="status-badge in-stock">ACCEPTED</span>;
      case 'Rejected': return <span className="status-badge out-of-stock">REJECTED</span>;
      case 'Delivered': return <span className="status-badge in-stock">DELIVERED</span>;
      default: return <span className="status-badge low-stock">PENDING</span>;
    }
  };

  return (
    <div className="dashboard-content">
      <div className="panel full-width">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">{isAdmin ? 'Order Fulfillment' : 'My Requests'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {isAdmin ? 'Verify customer orders and assign delivery timelines.' : 'Track your equipment and stock requests.'}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  {isAdmin && <th>Customer</th>}
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Delivery Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--accent)' }}>#{order._id.slice(-6).toUpperCase()}</span>
                    </td>
                    {isAdmin && (
                      <td>
                         <div style={{ fontWeight: 500 }}>{order.createdBy}</div>
                      </td>
                    )}
                    <td>₹{order.totalPrice.toFixed(2)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      {order.status === 'Accepted' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--success)' }}>
                            <Calendar size={14} /> {new Date(order.deliveryDate).toLocaleDateString()}
                          </div>
                          {order.adminMessage && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              <MessageSquare size={14} /> {order.adminMessage}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{order.status === 'Rejected' ? 'N/A' : 'Awaiting Review'}</span>
                      )}
                    </td>
                    <td>
                      {isAdmin && order.status === 'Pending' ? (
                        <button onClick={() => setSelectedOrder(order)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                          Process Order
                        </button>
                      ) : (
                        <button onClick={() => setSelectedOrder(order)} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                          {isAdmin ? 'View Details' : 'View Receipt'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL OVERLAY */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--backdrop)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '1rem' }}>
          

          {isAdmin && selectedOrder.status === 'Pending' ? (
            /* ==========================================================
               ADMIN PROCESSING VIEW (Receipt Style Sync)
               ========================================================== */
            <div className="auth-v2-card" style={{ maxWidth: '340px', width: '100%', padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-panel)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', position: 'relative', border: '1px solid var(--border)', margin: 'auto' }}>
              <button onClick={() => { setSelectedOrder(null); setAdminAction(null); }} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
              
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--nav-hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                    <Truck size={20} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Process Request</h3>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0, opacity: 0.7 }}>Order ID: #{selectedOrder._id.slice(-6).toUpperCase()}</p>
              </div>

              <div style={{ borderTop: '2px dashed var(--border)', borderBottom: '2px dashed var(--border)', padding: '1rem 0', margin: '0.5rem 0' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                   <span style={{ color: 'var(--text-secondary)' }}>Customer:</span>
                   <span style={{ fontWeight: 600 }}>{selectedOrder.createdBy.split('@')[0]}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                   <span style={{ color: 'var(--text-secondary)' }}>Items:</span>
                   <span style={{ fontWeight: 600 }}>{selectedOrder.products.reduce((a,b)=>a+b.quantity, 0)} Units</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                   <span style={{ fontWeight: 700 }}>Total Value:</span>
                   <span style={{ fontWeight: 800, color: 'var(--accent)' }}>₹{selectedOrder.totalPrice.toFixed(2)}</span>
                 </div>
              </div>

              {!adminAction ? (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button onClick={() => setAdminAction('accept')} className="btn btn-primary" style={{ flex: 1, background: 'var(--success)', height: '40px', fontSize: '0.85rem' }}>Approve</button>
                  <button onClick={() => setAdminAction('reject')} className="btn btn-primary" style={{ flex: 1, background: 'var(--danger)', height: '40px', fontSize: '0.85rem' }}>Reject</button>
                </div>
              ) : (
                <form onSubmit={handleStatusUpdate} className="auth-v2-form" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
                   {adminAction === 'accept' && (
                     <div className="form-group">
                       <label className="form-label" style={{ fontSize: '0.75rem' }}>Delivery Date</label>
                       <div className="input-with-icon">
                         <Calendar className="input-icon" size={14} style={{ left: '0.75rem' }} />
                         <input required type="date" className="form-input" style={{ padding: '0.5rem 0.5rem 0.5rem 2.25rem', fontSize: '0.85rem' }} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                       </div>
                     </div>
                   )}
                   <div className="form-group">
                     <label className="form-label" style={{ fontSize: '0.75rem' }}>Note (Optional)</label>
                     <div className="input-with-icon">
                       <MessageSquare className="input-icon" style={{ top: '10px', left: '0.75rem' }} size={14} />
                       <textarea className="form-input" style={{ minHeight: '60px', paddingTop: '8px', paddingLeft: '2.25rem', fontSize: '0.85rem' }} placeholder="Add a note..." value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} />
                     </div>
                   </div>
                   <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                     <button type="button" onClick={() => setAdminAction(null)} className="btn btn-secondary" style={{ flex: 1, height: '40px', fontSize: '0.85rem' }}>Back</button>
                     <button type="submit" className="btn btn-primary" style={{ flex: 2, height: '40px', fontSize: '0.85rem' }}>Confirm {adminAction === 'accept' ? 'Approval' : 'Reject'}</button>
                   </div>
                </form>
              )}
            </div>
          ) : (
            /* ==========================================================
               USER RECEIPT VIEW (Polished to match Add Product style)
               ========================================================== */
            <div className="auth-v2-card" style={{ maxWidth: '340px', width: '100%', padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-panel)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', position: 'relative', border: '1px solid var(--border)', margin: 'auto' }}>
               <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
               
               <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', background: 'var(--nav-hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                    <Package size={20} color="var(--accent)" />
                 </div>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Receipt</h3>
                 <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0, opacity: 0.7 }}>ID: #{selectedOrder._id.slice(-6).toUpperCase()}</p>
                 {isAdmin && <p style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: '4px' }}>Assigned to you ({selectedOrder.assignedTo})</p>}
               </div>

               <div style={{ borderTop: '2px dashed var(--border)', borderBottom: '2px dashed var(--border)', padding: '1rem 0', margin: '0.5rem 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><UserIcon size={12} /> Customer</span>
                      <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>{selectedOrder.createdBy}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Package size={12} /> Items</span>
                      <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>{selectedOrder.products.reduce((a,b)=>a+b.quantity, 0)} Units</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Total Paid</span>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>₹{selectedOrder.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
               </div>

               <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '16px', background: 'var(--bg-secondary)', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                    {selectedOrder.status === 'Accepted' ? (
                      <CheckCircle size={14} color="var(--success)" />
                    ) : selectedOrder.status === 'Rejected' ? (
                      <XCircle size={14} color="var(--danger)" />
                    ) : (
                      <Clock size={14} color="var(--warning)" />
                    )}
                    <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                      {selectedOrder.status === 'Accepted' ? 'Order Approved' : selectedOrder.status === 'Rejected' ? 'Order Rejected' : 'Processing Order'}
                    </span>
                  </div>
                  
                  {selectedOrder.status === 'Accepted' && selectedOrder.deliveryDate && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>
                      Est. Delivery: {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                    </div>
                  )}

                  {selectedOrder.adminMessage && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.8 }}>
                      "{selectedOrder.adminMessage}"
                    </p>
                  )}
               </div>

               <button onClick={() => setSelectedOrder(null)} className="btn btn-primary full-width" style={{ borderRadius: '12px', height: '40px', fontWeight: 700, fontSize: '0.85rem' }}>
                 Close View
               </button>
               
               <p style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.75rem', opacity: 0.6 }}>
                  Thank you for using InvenSync 💜
               </p>
            </div>

          )}
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
