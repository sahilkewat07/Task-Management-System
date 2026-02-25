# Flux — Employee Task Manager

**Flux** is a high-performance, enterprise-grade SaaS platform designed for modern task management. It features a clean, professional light-mode dashboard UI, real-time synchronization, and a hardened security architecture, providing a seamless experience for both Administrators and Employees.

---

## 🚀 Tech Stack

### **Frontend (Client)**

| Tool | Purpose |
|---|---|
| **React 18** | Core UI library for building component-driven interfaces |
| **Vite** | Lightning-fast development server and build tool |
| **React Router DOM v6** | Client-side routing and navigation |
| **Tailwind CSS v3** | Utility-first CSS framework for responsive styling |
| **Framer Motion** | Declarative animations and page transitions |
| **Axios** | Promise-based HTTP client for REST API communication |
| **Socket.IO Client** | Real-time bidirectional event communication |
| **Lucide React** | Crisp, scalable icon library |
| **React Hot Toast** | Elegant, non-intrusive toast notifications |
| **date-fns** | Lightweight date utility functions |
| **clsx** | Utility for conditionally constructing `className` strings |
| **tailwind-merge** | Intelligently merges Tailwind CSS classes without conflicts |
| **PostCSS & Autoprefixer** | CSS processing and vendor prefixing |

### **Backend (Server)**

| Tool | Purpose |
|---|---|
| **Node.js** | JavaScript runtime environment |
| **Express v5** | Minimal and flexible RESTful API framework |
| **MongoDB** | NoSQL document database for flexible data modeling |
| **Mongoose** | MongoDB ODM with schema validation and compound indexing |
| **Socket.IO** | Real-time event orchestration for task updates |
| **JSON Web Tokens (JWT)** | Secure, stateless authentication mechanism |
| **bcryptjs** | Password hashing and verification |
| **express-validator** | Middleware for request body validation and sanitization |
| **Helmet** | Sets HTTP security headers for production hardening |
| **express-rate-limit** | Rate limiting middleware to prevent abuse |
| **Morgan** | HTTP request logger |
| **Multer** | Multipart/form-data middleware for file uploads |
| **CORS** | Cross-Origin Resource Sharing configuration |
| **dotenv** | Loads environment variables from `.env` file |
| **Nodemon** | Auto-restarts the server on file changes during development |

---

## 📂 Folder Structure

```text
Task-Management-System/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components (StatCard, Badge, modals, etc.)
│   │   ├── context/            # Global State (Auth, Theme, Socket)
│   │   ├── pages/              # Role-specific Dashboards (Admin/Employee)
│   │   ├── services/           # Axios API instance configuration
│   │   └── App.jsx             # Route Orchestration & Protection
│   ├── tailwind.config.js      # Custom Theme & Design Tokens
│   └── vite.config.js          # Vite build configuration
├── server/                     # Node.js Backend
│   ├── config/                 # Database connection (db.js)
│   ├── controllers/            # Business logic (auth, task, user)
│   ├── middleware/             # Role verification, validation, error handling
│   ├── models/                 # Mongoose Schemas (User.js, Task.js)
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # AsyncHandler, ErrorResponse utilities
│   └── server.js               # Application entry point
└── README.md                   # Project documentation
```

---

## ✨ Key Features

1. **Role-Based Dashboards** — Separate, tailored views for Admins and Employees with protected routes.
2. **Real-Time Synchronization** — Instant notifications and live dashboard updates via Socket.IO when tasks are created, assigned, or updated.
3. **Secure Authentication** — JWT-based stateless auth with bcrypt password hashing and protected API endpoints.
4. **Request Validation & Sanitization** — All inputs validated server-side using `express-validator` to prevent malformed data.
5. **Security Hardening** — HTTP headers secured with Helmet, rate limiting enabled, and centralized error handling via `ErrorResponse`.
6. **Animated UI** — Smooth page transitions and micro-animations powered by Framer Motion for a premium feel.
7. **Auto-Login Workflow** — Seamless onboarding with immediate dashboard redirection upon registration.
8. **Performance Optimized** — Compound indexing on MongoDB for critical query paths.

---

## 🛠️ How to Run

### **1. Prerequisites**
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### **2. Backend Setup**
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `server` folder:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/taskmanager
    JWT_SECRET=your_super_secret_key
    JWT_EXPIRES_IN=30d
    ```
4. Start the server: `npm run dev`

### **3. Frontend Setup**
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser at `http://localhost:5173`

---

## 🧪 Database & Core Functions

### **Database Models**
- **User** — Stores identities with bcrypt-hashed passwords and roles (`admin`, `employee`).
- **Task** — Stores task details, priority (`Low`, `Medium`, `High`), status (`Pending`, `In Progress`, `Completed`), and references to assignees.

### **Core API Functions**
- `register()` — Automates identity creation and initiates an immediate JWT session.
- `createTask()` — Orchestrates task assignment and emits real-time socket events to the target employee.
- `updateTaskStatus()` — Allows employees to sync their progress back in real time.
- `getDashboardStats()` — Role-aware aggregation of system metrics.
