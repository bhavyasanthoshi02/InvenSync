import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Store,
  LogOut,
  User as UserIcon,
  MapPin
} from 'lucide-react';
import InvenSyncLogo from './InvenSyncLogo.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { API_BASE } from '../config';

export default function MainLayout() {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const [toasts, setToasts] = useState([]);
  const lastLogTimeRef = useRef(new Date().toISOString());

  useEffect(() => {
    if (!token || !isAdmin) return;

    const pollLogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const newLogs = data.data.filter(log => {
            return log.createdAt > lastLogTimeRef.current;
          });

          if (newLogs.length > 0) {
            newLogs.reverse().forEach(log => {
              const id = Math.random().toString(36).substr(2, 9);
              setToasts(prev => [...prev, { id, message: `${log.user}: ${log.message}` }]);
              
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
              }, 5000);
            });
          }
          lastLogTimeRef.current = data.data[0].createdAt;
        }
      } catch (err) {
        console.error('Failed to poll logs', err);
      }
    };

    const interval = setInterval(pollLogs, 6000);
    return () => clearInterval(interval);
  }, [token, isAdmin, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <InvenSyncLogo size={32} className="logo-icon" />
          <span className="logo-text">InvenSync</span>
        </div>

        <nav className="nav-links">
          {isAdmin ? (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                <LayoutDashboard size={20} />
                Dashboard
              </NavLink>
              <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Package size={20} />
                Manage Inventory
              </NavLink>
              <NavLink to="/shelf-planner" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <MapPin size={20} />
                Shelf Planner
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <ShoppingCart size={20} />
                Orders Fulfillment
              </NavLink>
              <NavLink to="/suppliers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Users size={20} />
                Suppliers
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                <Store size={20} />
                Catalog
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <ShoppingCart size={20} />
                My Orders
              </NavLink>
            </>
          )}
          
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            Settings
          </NavLink>
        </nav>

        <div className="user-profile" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
          <div 
            onClick={() => navigate('/settings')} 
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
            title="View Profile Settings"
          >
            <div className="avatar">{user ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user ? user.name : 'User'}</span>
              <span className="user-role">{isAdmin ? 'Admin' : 'Users'}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              padding: '0.5rem',
              fontSize: '0.85rem'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 className="page-title">
              {isAdmin ? 'Admin Portal' : 'User Portal'}
            </h1>
          </div>
          <div className="header-actions">
            <div 
              className="icon-btn" 
              title="Profile" 
              onClick={() => navigate('/settings')} 
              style={{ cursor: 'pointer' }}
            >
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Real-time Alerts Toast Container */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--accent)',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideIn 0.3s ease forwards',
            minWidth: '260px',
            maxWidth: '360px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></div>
            <div style={{ flex: 1 }}>{t.message}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
