import { TrendingUp, DollarSign, Package, Globe } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000, orders: 120 },
  { month: "Feb", revenue: 52000, orders: 145 },
  { month: "Mar", revenue: 48000, orders: 132 },
  { month: "Apr", revenue: 61000, orders: 168 },
  { month: "May", revenue: 55000, orders: 155 },
  { month: "Jun", revenue: 67000, orders: 189 },
];

const categoryData = [
  { name: "Textiles", value: 35 },
  { name: "Metals", value: 25 },
  { name: "Construction", value: 20 },
  { name: "Wood", value: 12 },
  { name: "Industrial", value: 8 },
];

const topProducts = [
  { name: "Cotton Fabric", sales: 450 },
  { name: "Steel Rods", sales: 380 },
  { name: "Glass Panels", sales: 320 },
  { name: "Wooden Planks", sales: 290 },
  { name: "Aluminum Sheets", sales: 250 },
];

const regionData = [
  { region: "North America", revenue: 85000 },
  { region: "Europe", revenue: 72000 },
  { region: "Asia", revenue: 58000 },
  { region: "Middle East", revenue: 45000 },
  { region: "Africa", revenue: 28000 },
];

const COLORS = ["#4f46e5", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b"];

const metrics = [
  { title: "Total Revenue", value: "$328,000", change: "+18%", icon: DollarSign, color: "text-chart-4" },
  { title: "Total Sales", value: "2,890", change: "+12%", icon: Package, color: "text-chart-1" },
  { title: "Avg. Order Value", value: "$113.49", change: "+5%", icon: TrendingUp, color: "text-chart-2" },
  { title: "Export Markets", value: "24", change: "+3", icon: Globe, color: "text-chart-3" },
];

export function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1>Analytics</h1>
        <p className="text-muted-foreground mt-1">Detailed insights into your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-muted-foreground mb-1">{metric.title}</p>
                  <h2 className="mb-2">{metric.value}</h2>
                  <div className="text-sm text-success">{metric.change}</div>
                </div>
                <div className={`p-3 rounded-lg bg-secondary ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-6">Revenue & Orders Overview</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis yAxisId="left" stroke="#64748b" />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2}
              name="Revenue ($)"
              dot={{ fill: "#4f46e5" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#06b6d4"
              strokeWidth={2}
              name="Orders"
              dot={{ fill: "#06b6d4" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-6">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-6">Revenue by Region</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="region" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}