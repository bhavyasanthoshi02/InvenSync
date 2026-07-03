# InvenSync

InvenSync is a modern, responsive, and feature-rich **Inventory Management System** designed to streamline tracking of products, suppliers, orders, and activity logs. Built on the **MERN** stack (MongoDB, Express, React, Node.js), it provides real-time stock insights, visual sales/stock analytics, and role-based access control.

---

## Advanced Key Features

InvenSync has been updated with several enterprise-grade features to enhance warehouse picking logistics, data integrity, and inventory analytics:

*   **AI-Powered Sales & Demand Forecasting**: A built-in forecasting engine that evaluates historical inventory sales velocity to predict monthly demand, calculate required restock buffers, and assign safety stock levels.
*   **Live WebRTC Barcode & QR Camera Scanner**: Directly scan physical items using your device's camera to lookup products, auto-increment existing quantities in real-time, or automatically pre-populate catalog entry forms.
*   **Interactive Warehouse Shelf Planner**: A visual 2D warehouse map that allows managers to organize stock placements on aisles and shelves.
*   **Dijkstra/BFS Walking Route Optimizer**: Once a product is selected in the shelf planner, a Breadth-First Search (BFS) pathfinder computes and visually traces the shortest path through corridors from the warehouse entrance to the shelf.
*   **Database Time-Travel Ledger & State Rollbacks**: An audit history tracking all quantity and pricing changes. If a mistake is made, admins can review previous revision checkpoints and restore the database state with a single click.
*   **QR Code Label Generator & Sticky Label Printer**: Dynamically renders high-resolution QR labels for any product, carrying SKUs, batch numbers, and locations, with targeted print stylesheets for thermal label printing.
*   **Workspace Themes (Rose Gold & Royal Blue)**: A state-managed workspace personalization engine supporting Default Slate, Emerald Forest, Rose Gold, and Royal Blue color themes persisted via LocalStorage.
*   **Live Multi-User Activity Logging**: Low-latency background log polling that delivers real-time toast alert popups on the dashboard when concurrent changes are made in the system.
*   **Batch & Expiry Management**: Keep track of batch tags and expiration dates. The system triggers warnings (`⚠️ Expiring Soon`, `⚠️ Expired`) to help prevent stock write-offs.
*   **Bulk Data & Physical Reports**: Complete support for CSV spreadsheet imports, exports, and `@media print` layout formatting.
*   **Role-Based Access Control (RBAC)**: Secure user login and registration with token validation and role-based action guards.

---

## Technology Stack

### Frontend
*   **React (v19)**: Component-based UI rendering.
*   **Vite**: Next-generation frontend tooling for fast hot module replacement (HMR).
*   **React Router (v7)**: Client-side routing.
*   **Recharts**: Responsive charting library for analytics.
*   **Lucide React**: Clean, modern icon set.
*   **Vanilla CSS**: High-performance, tailored modern styling.

### Backend
*   **Node.js & Express**: Fast, unopinionated web framework for backend APIs.
*   **MongoDB & Mongoose**: NoSQL database for flexible and structured data modeling.
*   **JSON Web Tokens (JWT)**: Secure user session management and authentication.
*   **Bcrypt.js**: Strong password hashing.

---

## Project Structure

```text
Inventory/
├── backend/
│   ├── config/             # DB and configuration setups
│   ├── controllers/        # Express request handlers
│   ├── middleware/         # Auth and error middleware
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API routing endpoints
│   ├── utils/              # Helper utilities
│   ├── .env                # Backend environment variables
│   ├── server.js           # Express server entrypoint
│   └── package.json        # Backend dependencies & scripts
│
└── frontend/
    ├── public/             # Static public assets
    ├── src/
    │   ├── assets/         # App images, SVGs, and styles
    │   ├── components/     # Reusable layout and UI components
    │   ├── context/        # React context providers (Auth, Theme)
    │   ├── pages/          # Page components (Dashboard, Inventory, etc.)
    │   ├── App.jsx         # App router and layout entrypoint
    │   ├── index.css       # Global styles and tailormade tokens
    │   └── main.jsx        # Frontend entry point
    ├── vite.config.js      # Vite compilation configuration
    └── package.json        # Frontend dependencies & scripts
```

---

## Installation & Setup

### Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/bhavyasanthoshi02/Inventory.git
cd Inventory
```

---

### Step 2: Configure the Backend Environment
Create a `.env` file inside the `backend` directory:
```bash
# Navigate to backend
cd backend
touch .env
```
Add the following configuration settings:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventoryx
JWT_SECRET=supersecret_key_inventoryx_2026
JWT_EXPIRE=30d
NODE_ENV=development
```

---

### Step 3: Install Backend Dependencies & Start Server
```bash
# Inside the backend directory
npm install
node server.js
```
The backend server will spin up on `http://localhost:5000`.

---

### Step 4: Install Frontend Dependencies & Start App
In a new terminal window:
```bash
# Navigate to frontend
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173` to see the application in action.

---

## API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/users/signup` | Register a new user | Public |
| **POST** | `/api/users/login` | Login user and retrieve JWT token | Public |
| **GET** | `/api/dashboard` | Fetch dashboard analytics metrics | Private |
| **GET** | `/api/products` | Retrieve all catalog products | Private |
| **POST** | `/api/products` | Create a new product | Private (Admin/Manager) |
| **GET** | `/api/orders` | Fetch list of all orders | Private |
| **GET** | `/api/suppliers` | Retrieve list of all suppliers | Private |
| **GET** | `/api/logs` | Retrieve action and system event logs | Private |

---

## Authors
Developed and maintained by **Ujwal** and **Bhavya**.

