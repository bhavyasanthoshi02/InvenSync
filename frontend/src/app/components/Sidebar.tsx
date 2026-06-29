import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Activity,
  Settings
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/orders", label: "Orders", icon: ShoppingCart },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/activity", label: "Activity Logs", icon: Activity },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <h1 className="text-sidebar-foreground">
          <Package className="inline-block w-6 h-6 mr-2 text-primary" />
          <span className="font-semibold">ExportFlow</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}