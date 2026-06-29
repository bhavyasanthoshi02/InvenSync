import { User, Bell, Lock, Globe, Database, CreditCard } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-4 space-y-1">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-primary/10 text-primary flex items-center gap-3">
              <User className="w-5 h-5" />
              Profile
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary flex items-center gap-3">
              <Bell className="w-5 h-5" />
              Notifications
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary flex items-center gap-3">
              <Lock className="w-5 h-5" />
              Security
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary flex items-center gap-3">
              <Globe className="w-5 h-5" />
              Preferences
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary flex items-center gap-3">
              <Database className="w-5 h-5" />
              Data & Storage
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              Billing
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="Admin"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="User"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue="admin@exportflow.com"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Company Name</label>
                  <input
                    type="text"
                    defaultValue="ExportFlow Inc."
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="mb-4">Business Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Currency</label>
                  <select className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>JPY (¥)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Timezone</label>
                  <select className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>UTC-05:00 (Eastern Time)</option>
                    <option>UTC-08:00 (Pacific Time)</option>
                    <option>UTC+00:00 (GMT)</option>
                    <option>UTC+08:00 (Singapore)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Low Stock Threshold</label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Alert when product stock falls below this value
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="mb-4">Email Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-primary"
                  />
                  <div>
                    <p>New Order Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email when a new order is placed
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-primary"
                  />
                  <div>
                    <p>Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when products are running low
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <div>
                    <p>Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary of business performance
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}