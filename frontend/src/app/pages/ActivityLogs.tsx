import { Search, Package, ShoppingCart, Truck, AlertTriangle, Settings as SettingsIcon, Users } from "lucide-react";
import { useState } from "react";

type Activity = {
  id: number;
  type: "inventory" | "order" | "shipment" | "alert" | "system" | "user";
  action: string;
  user: string;
  timestamp: string;
  details?: string;
};

const activities: Activity[] = [
  {
    id: 1,
    type: "order",
    action: "New order placed",
    user: "System",
    timestamp: "2026-04-18 14:32",
    details: "Order #ORD-2847 from ABC Trading Co.",
  },
  {
    id: 2,
    type: "inventory",
    action: "Stock updated",
    user: "Admin",
    timestamp: "2026-04-18 14:15",
    details: "Cotton Fabric stock increased by 200 units",
  },
  {
    id: 3,
    type: "shipment",
    action: "Order shipped",
    user: "Warehouse Manager",
    timestamp: "2026-04-18 13:45",
    details: "Order #ORD-2845 shipped via FedEx",
  },
  {
    id: 4,
    type: "alert",
    action: "Low stock alert triggered",
    user: "System",
    timestamp: "2026-04-18 12:30",
    details: "Steel Rods stock below threshold (12/30)",
  },
  {
    id: 5,
    type: "user",
    action: "User logged in",
    user: "John Doe",
    timestamp: "2026-04-18 09:00",
    details: "Login from IP: 192.168.1.1",
  },
  {
    id: 6,
    type: "inventory",
    action: "New product added",
    user: "Admin",
    timestamp: "2026-04-17 16:20",
    details: "Ceramic Tiles added to inventory",
  },
  {
    id: 7,
    type: "order",
    action: "Order delivered",
    user: "System",
    timestamp: "2026-04-17 11:15",
    details: "Order #ORD-2844 delivered successfully",
  },
  {
    id: 8,
    type: "system",
    action: "System backup completed",
    user: "System",
    timestamp: "2026-04-17 03:00",
    details: "Database backup completed successfully",
  },
  {
    id: 9,
    type: "inventory",
    action: "Stock adjustment",
    user: "Warehouse Manager",
    timestamp: "2026-04-16 15:30",
    details: "Glass Panels stock adjusted for damaged items",
  },
  {
    id: 10,
    type: "alert",
    action: "Out of stock alert",
    user: "System",
    timestamp: "2026-04-16 10:00",
    details: "Rubber Mats out of stock",
  },
];

export function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "inventory":
        return Package;
      case "order":
        return ShoppingCart;
      case "shipment":
        return Truck;
      case "alert":
        return AlertTriangle;
      case "system":
        return SettingsIcon;
      case "user":
        return Users;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "inventory":
        return "bg-chart-1/10 text-chart-1";
      case "order":
        return "bg-chart-2/10 text-chart-2";
      case "shipment":
        return "bg-chart-3/10 text-chart-3";
      case "alert":
        return "bg-warning/10 text-warning";
      case "system":
        return "bg-muted text-muted-foreground";
      case "user":
        return "bg-success/10 text-success";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Track all system activities and changes</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Types</option>
          <option value="inventory">Inventory</option>
          <option value="order">Orders</option>
          <option value="shipment">Shipments</option>
          <option value="alert">Alerts</option>
          <option value="system">System</option>
          <option value="user">Users</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4>{activity.action}</h4>
                    <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  {activity.details && (
                    <p className="text-sm text-muted-foreground mb-1">{activity.details}</p>
                  )}
                  <p className="text-sm text-muted-foreground">By: {activity.user}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}