import { useState } from "react";
import { Search, Filter, Plus, Edit, Trash2, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
};

const products: Product[] = [
  { id: "PRD-001", name: "Cotton Fabric", category: "Textiles", stock: 450, price: "$12.50", status: "in-stock" },
  { id: "PRD-002", name: "Steel Rods", category: "Metals", stock: 12, price: "$45.00", status: "low-stock" },
  { id: "PRD-003", name: "Ceramic Tiles", category: "Construction", stock: 0, price: "$8.75", status: "out-of-stock" },
  { id: "PRD-004", name: "Wooden Planks", category: "Wood", stock: 230, price: "$25.00", status: "in-stock" },
  { id: "PRD-005", name: "Leather Sheets", category: "Textiles", stock: 85, price: "$35.50", status: "in-stock" },
  { id: "PRD-006", name: "Aluminum Sheets", category: "Metals", stock: 34, price: "$52.00", status: "low-stock" },
  { id: "PRD-007", name: "Glass Panels", category: "Construction", stock: 156, price: "$18.00", status: "in-stock" },
  { id: "PRD-008", name: "Rubber Mats", category: "Industrial", stock: 0, price: "$14.25", status: "out-of-stock" },
];

export function Inventory() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-muted-foreground">Product ID</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Product Name</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Category</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Stock</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Price</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Status</th>
              <th className="text-left px-6 py-4 text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-muted-foreground">{product.id}</td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${
                      product.status === "in-stock"
                        ? "bg-success/10 text-success"
                        : product.status === "low-stock"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {product.status === "in-stock"
                      ? "In Stock"
                      : product.status === "low-stock"
                      ? "Low Stock"
                      : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-md border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3>Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Category</label>
                <select className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Textiles</option>
                  <option>Metals</option>
                  <option>Construction</option>
                  <option>Wood</option>
                  <option>Industrial</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Price</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="$0.00"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}