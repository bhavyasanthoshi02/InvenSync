import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

export function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium">AD</span>
            </div>
            <ChevronDown className="w-4 h-4 text-foreground" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
              <button className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors">
                Settings
              </button>
              <div className="border-t border-border my-1"></div>
              <button className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors text-destructive">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
