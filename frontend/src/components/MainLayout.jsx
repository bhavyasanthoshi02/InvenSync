import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Box,
  Store,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <Box className="logo-icon" size={32} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <div className="icon-btn" title="Profile">
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
