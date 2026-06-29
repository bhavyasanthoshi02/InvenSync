import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Orders } from "./pages/Orders";
import { Analytics } from "./pages/Analytics";
import { ActivityLogs } from "./pages/ActivityLogs";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", Component: Inventory },
      { path: "orders", Component: Orders },
      { path: "analytics", Component: Analytics },
      { path: "activity", Component: ActivityLogs },
      { path: "settings", Component: Settings },
    ],
  },
]);