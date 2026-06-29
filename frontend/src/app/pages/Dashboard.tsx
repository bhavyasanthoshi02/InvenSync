import { Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpiData = [
  {
    title: "Total Products",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "text-chart-1",
  },
  {
    title: "Total Orders",
    value: "856",
    change: "+8%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-chart-2",
  },
  {
    title: "Revenue",
    value: "$124,500",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    color: "text-chart-4",
  },
  {
    title: "Low Stock Alerts",
    value: "24",
    change: "-5%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-warning",
  },
];

const exportTrends = [
  { month: "Jan", value: 45000 },
  { month: "Feb", value: 52000 },
  { month: "Mar", value: 48000 },
  { month: "Apr", value: 61000 },
  { month: "May", value: 55000 },
  { month: "Jun", value: 67000 },
];

const monthlyOrders = [
  { month: "Jan", orders: 120 },
  { month: "Feb", orders: 145 },
  { month: "Mar", orders: 132 },
  { month: "Apr", orders: 168 },
  { month: "May", orders: 155 },
  { month: "Jun", orders: 189 },
];

const recentActivity = [
  { id: 1, action: "New order #ORD-2847 placed", time: "2 minutes ago", type: "order" },
  { id: 2, action: "Product 'Steel Pipes' stock updated", time: "15 minutes ago", type: "inventory" },
  { id: 3, action: "Order #ORD-2845 shipped", time: "1 hour ago", type: "shipment" },
  { id: 4, action: "Low stock alert: Cotton Fabric", time: "2 hours ago", type: "alert" },
  { id: 5, action: "New product added: Ceramic Tiles", time: "3 hours ago", type: "inventory" },
];

const lowStockProducts = [
  { name: "Cotton Fabric", stock: 45, threshold: 100 },
  { name: "Ceramic Tiles", stock: 23, threshold: 50 },
  { name: "Steel Rods", stock: 12, threshold: 30 },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={kpi.title}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-muted-foreground mb-1">{kpi.title}</p>
                  <h2 className="mb-2">{kpi.value}</h2>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendIcon
                      className={`w-4 h-4 ${
                        kpi.trend === "up" ? "text-success" : "text-destructive"
                      }`}
                    />
                    <span
                      className={
                        kpi.trend === "up" ? "text-success" : "text-destructive"
                      }
                    >
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-secondary ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-6">Export Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={exportTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-6">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="orders" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "order"
                      ? "bg-chart-2"
                      : activity.type === "alert"
                      ? "bg-warning"
                      : "bg-chart-1"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-6">Low Stock Alerts</h3>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.name} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <p>{product.name}</p>
                  <span className="text-warning">
                    {product.stock} / {product.threshold}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full"
                    style={{
                      width: `${(product.stock / product.threshold) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}