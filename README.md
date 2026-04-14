

## ✨ The Vision

Most personal projects stick to basic CRUD operations. I built WorkSync to solve real-world engineering challenges: **multi-tenancy, scalable architecture, and robust security**. 

WorkSync functions like the engines behind enterprise applications (think Slack or Notion)—allowing multiple independent organizations to work securely on a shared backend infrastructure without data overlap.

---

## 🧠 Core Engineering Concepts

### 🏢 Multi-Tenant Architecture
Each organization (tenant) operates in a strictly isolated environment within a shared database architecture.
- Every record is securely bound via a `tenant_id`.
- Ensures zero data leakage between different companies on the platform.

### 🔐 Secure Auth & RBAC (Role-Based Access Control)
- **JWT-based authentication** for secure, stateless sessions.
- **Bcrypt password hashing** to protect user credentials.
- **Strict Role Hierarchies:**
  - `ADMIN`: Full organizational control (invite users, manage workflows).
  - `MEMBER`: Focused access (view/update assigned tasks).

### ⚙️ Scalable Backend & Data Management
- **Task Management System:** Tenant-aware querying ensures users strictly see only their organization's data. Implemented pagination to handle massive data sets efficiently.
- **Analytics Dashboard:** Uses optimized SQL aggregations on the backend to deliver real-time metrics (Total/Completed/Pending tasks) without choking the UI.
- **Activity Logging:** Comprehensive audit trails tracking user actions, simulating compliance standards used in enterprise applications.

### 🤝 Seamless Onboarding (Invite System)
- Admins can generate secure, time-boxed invite codes.
- New users are seamlessly grouped into the correct organization and automatically provisioned with the right roles.

---

## 🏗️ Architecture Stack

This project strictly follows a layered architecture pattern:

```text
Frontend (React + Tailwind)
       ⬇️ (REST API)
Backend (Node.js + Express)
       ⬇️ (Optimized SQL)
Database (PostgreSQL)
```

**Backend Design Pattern:**
- **Controllers** → Handle HTTP requests and responses.
- **Services** → Core business logic (keeps controllers lean).
- **Middleware** → Intercepts requests for Authentication, Authorization, and Tenant Validation.
- **Routes** → Maps endpoints to controllers.

---

## 🔒 Defense-in-Depth Security

Security isn't just an afterthought—it's implemented at every layer:
1. **Frontend:** UI components dynamically render based on user roles (Admin vs Member).
2. **Gateway:** Protected routes ensure unauthenticated requests are dropped immediately.
3. **Database Level:** Hardened backend validation guarantees that even if a malicious user bypasses the client, they cannot access unauthorized tenant data.

---

## 🚀 Getting Started

Want to run WorkSync locally? Follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/worksync.git
cd worksync
```

### 2. Configure the Backend
```bash
cd backend
npx nodemon server.js
```
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=worksync_db
DB_PASSWORD=yourpassword
DB_PORT=5432
JWT_SECRET=your_super_secret_key
```
Start the development server:
```bash
npm run dev
```

### 3. Configure the Database
- Create a PostgreSQL database named `worksync_db`.
- Run your initialization scripts to set up the schemas (`organizations`, `users`, `tasks`, `logs`).

### 4. Boot up the Frontend
```bash
cd frontend
npm install
npm run start
```

---

## 🐳 Docker Deployment (Optional)

If you prefer containerized environments, you can spin up the backend via Docker:
```bash
docker build -t worksync-backend .
docker run -p 5000:5000 worksync-backend
```

---

## 📘 API Documentation

The REST API is fully documented. Once the backend is running, explore the endpoints via Swagger UI:
👉 `http://localhost:5000/api-docs`

---

## 💡 Key Takeaways & Learnings

Building WorkSync was a massive leap from standard full-stack development. It taught me:
- How to architect robust **Multi-Tenant** systems.
- The intricacies of securing APIs using **JWT and RBAC middlewares**.
- Writing and optimizing complex **SQL queries** for dashboard analytics.
- Structuring a codebase for **maintainability and scalability**.

---

## 🎯 What's Next? (Roadmap)

- [ ] **Rate Limiting:** Implement per-tenant API limits to prevent abuse.
- [ ] **Email Integration:** Switch from code-based invites to email-based Magic Links.
- [ ] **Real-time Notifications:** Integrate WebSockets for live updates on task changes.

