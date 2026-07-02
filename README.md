# InvenSync

InvenSync is a modern, responsive, and feature-rich **Inventory Management System** designed to streamline tracking of products, suppliers, orders, and activity logs. Built on the **MERN** stack (MongoDB, Express, React, Node.js), it provides real-time stock insights, visual sales/stock analytics, and role-based access control.

---

## Key Features

*   **Dynamic Dashboard**: Overview of key business metrics (total inventory value, low-stock items, pending orders) with beautiful data visualizations powered by **Recharts**.
*   **Role-Based Authentication**: Secure login and signup with JWT token-based authentication and protected routes.
*   **Catalog Management**: Search, filter, page, and manage products with different categories, pricing, and stock levels.
*   **Real-time Inventory Tracking**: Add, update, and delete inventory levels with automated low-stock warnings.
*   **Order & Supplier Management**: Track supplier details and keep tabs on order request pipelines.
*   **Activity Logs**: Auditable logs of all system events to keep track of user and database actions.
*   **Settings Panel**: Customize and view system preferences and user profile configurations.

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

