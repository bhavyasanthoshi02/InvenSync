import React, { useState, useEffect, useContext } from 'react';
import { Package, TrendingUp, AlertTriangle, ArrowUpRight, Image as ImageIcon, MoreVertical } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext.jsx';
import { API_BASE } from '../config';

const salesData = [
  { name: 'Mon', revenue: 4000, items: 240 },
  { name: 'Tue', revenue: 3000, items: 139 },
  { name: 'Wed', revenue: 2000, items: 980 },
  { name: 'Thu', revenue: 2780, items: 390 },
  { name: 'Fri', revenue: 1890, items: 480 },
  { name: 'Sat', revenue: 2390, items: 380 },
  { name: 'Sun', revenue: 3490, items: 430 },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, lowStockProducts: [] });
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setMetrics(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) fetchDashboard();
  }, [token]);

  return (
    <div className="dashboard-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-title">Total Products</span>
            <span className="stat-value">{loading ? '-' : metrics.totalProducts}</span>
            <span className="stat-trend positive">
              <TrendingUp size={16} /> Current Catalog
            </span>
          </div>
          <div className="stat-icon" style={{ color: 'var(--accent)' }}>
            <Package size={28} />
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-info">
            <span className="stat-title">Total Value Sold</span>
            <span className="stat-value">₹{loading ? '-' : metrics.totalRevenue}</span>
            <span className="stat-trend positive">
              <TrendingUp size={16} /> From delivered orders
            </span>
          </div>
          <div className="stat-icon" style={{ color: 'var(--success)' }}>
            <ArrowUpRight size={28} />
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-info">
            <span className="stat-title">Low Stock Items</span>
            <span className="stat-value">{loading ? '-' : metrics.lowStockProducts.length}</span>
            <span className="stat-trend negative">
              <AlertTriangle size={16} /> Needs attention
            </span>
          </div>
          <div className="stat-icon" style={{ color: 'var(--warning)' }}>
            <AlertTriangle size={28} />
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="charts-grid">
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Revenue & Volume Trends</h2>
            <span className="panel-action">View Full Report</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12}} dy={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Alert: Low Stock Products</h2>
            <span className="panel-action">Manage Stock</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Level</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {!loading && metrics.lowStockProducts.length === 0 ? (
                   <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No low stock alerts!</td></tr>
                ) : (
                  metrics.lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-img">
                            <ImageIcon size={18} />
                          </div>
                          <span className="product-name">{product.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge low-stock">
                          {product.quantity} UNITS
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{product.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
