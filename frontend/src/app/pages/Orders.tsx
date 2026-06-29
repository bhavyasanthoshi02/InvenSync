import { useState } from "react";
import { Search, Eye, X, Check } from "lucide-react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

type Order = {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  amount: string;
  status: OrderStatus;
  date: string;
};

const orders: Order[] = [
  { id: "ORD-2847", customer: "ABC Trading Co.", product: "Cotton Fabric", quantity: 500, amount: "$6,250", status: "pending", date: "2026-04-18" },
  { id: "ORD-2846", customer: "Global Exports Ltd.", product: "Steel Rods", quantity: 200, amount: "$9,000", status: "processing", date: "2026-04-18" },
  { id: "ORD-2845", customer: "MegaBuild Inc.", product: "Ceramic Tiles", quantity: 1000, amount: "$8,750", status: "shipped", date: "2026-04-17" },
  { id: "ORD-2844", customer: "Textile World", product: "Leather Sheets", quantity: 150, amount: "$5,325", status: "delivered", date: "2026-04-16" },
  { id: "ORD-2843", customer: "Construction Hub", product: "Glass Panels", quantity: 300, amount: "$5,400", status: "shipped", date: "2026-04-16" },
  { id: "ORD-2842", customer: "MetalWorks Pro", product: "Aluminum Sheets", quantity: 80, amount: "$4,160", status: "delivered", date: "2026-04-15" },
];

const orderSteps = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "processing":
        return "bg-chart-1/10 text-chart-1";
      case "shipped":
        return "bg-chart-3/10 text-chart-3";
      case "delivered":
        return "bg-success/10 text-success";
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return orderSteps.findIndex((step) => step.key === status);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage your export orders</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-muted-foreground">Order ID</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Customer</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Product</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Quantity</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Amount</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Status</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Date</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-muted-foreground">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.product}</td>
                <td className="px-6 py-4">{order.quantity}</td>
                <td className="px-6 py-4">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3>Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p>{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer</p>
                  <p>{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p>{selectedOrder.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Product</p>
                  <p>{selectedOrder.product}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                  <p>{selectedOrder.quantity}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-4">Order Progress</p>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {orderSteps.map((step, index) => {
                      const currentStepIndex = getStepIndex(selectedOrder.status);
                      const isCompleted = index <= currentStepIndex;
                      const isActive = index === currentStepIndex;

                      return (
                        <div key={step.key} className="flex-1 flex flex-col items-center relative">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                              isCompleted
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-card border-border text-muted-foreground"
                            } ${isActive ? "ring-4 ring-primary/20" : ""}`}
                          >
                            {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                          </div>
                          <p className="text-sm mt-2">{step.label}</p>
                          {index < orderSteps.length - 1 && (
                            <div
                              className={`absolute top-5 left-1/2 h-0.5 w-full transition-colors ${
                                index < currentStepIndex ? "bg-primary" : "bg-border"
                              }`}
                            ></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}