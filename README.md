# WorkSync

WorkSync is a multi-tenant workflow and task management platform built for teams and organizations to collaborate securely within isolated workspaces.

The project focuses on solving practical backend engineering problems like:

* tenant isolation
* role-based access control
* secure authentication
* scalable backend architecture
* efficient task management

The idea behind WorkSync was to move beyond simple CRUD applications and build something closer to how real SaaS collaboration platforms work.

---

# Features

## Multi-Tenant Architecture

Each organization works inside its own isolated workspace while sharing the same backend infrastructure.

* Every record is associated with a `tenant_id`
* Users can only access data belonging to their organization
* Prevents cross-organization data access

---

## Authentication & Authorization

* JWT-based authentication
* Password hashing using bcrypt
* Role-Based Access Control (RBAC)

### Roles

### ADMIN

* Manage organization
* Invite team members
* Create and manage tasks

### MEMBER

* View assigned tasks
* Update task progress

---

## Task Management

* Create and manage tasks
* Update task status
* Pagination support for large datasets
* Tenant-aware task queries
* Organization-specific task visibility

---

## Dashboard & Analytics

The dashboard provides organization-level insights such as:

* Total Tasks
* Completed Tasks
* Pending Tasks

Analytics are generated using optimized SQL queries on the backend.

---

## Invite-Based Team Onboarding

Admins can generate invite codes for new members.

Features:

* Secure invite flow
* Automatic organization mapping
* Role provisioning during onboarding
* Expiring invite codes

---

## Data Consistency

PostgreSQL transactions are used for workflows like organization creation and invite-based onboarding to ensure related database operations are completed safely and consistently.

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## Authentication

* JWT
* bcrypt

---

# Backend Architecture

The backend follows a layered architecture pattern:

* **Controllers** → Handle request/response logic
* **Services** → Business logic layer
* **Middleware** → Authentication, authorization, and tenant validation
* **Routes** → API endpoint management

---

# Security Features

Security is implemented across multiple layers:

* Protected routes using JWT authentication
* Role-based frontend rendering
* Tenant validation on backend queries
* Secure password hashing using bcrypt
* Backend validation to prevent unauthorized data access

---

# Screenshots

All project screenshots are available inside the `/screenshots` folder.

Included Screenshots:


* Authentication & Organization Setup(![alt text](<workSync_ss/workSync_ss/Screenshot 2026-05-24 195723.png>))
* Admin Dashboard(![alt text](<workSync_ss/workSync_ss/Screenshot 2026-05-24 200051.png>))
* Task Management(![alt text](<workSync_ss/workSync_ss/Screenshot 2026-05-24 200258.png>))
* Invite System(![alt text](<workSync_ss/workSync_ss/Screenshot 2026-05-24 200341.png>))
* Member Dashboard(![alt text](<workSync_ss/workSync_ss/Screenshot 2026-05-24 200454.png>))
* Role-Based Access Views

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/worksync.git
cd worksync
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `/backend` directory:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=worksync_db
DB_PASSWORD=yourpassword
DB_PORT=5432
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

---

## 3. Database Setup

Create a PostgreSQL database named:

```bash
worksync_db
```

Run your SQL initialization scripts to create:

* organizations
* users
* tasks
* logs

---

## 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# API Documentation

Swagger documentation is available at:

```bash
http://localhost:5000/api-docs
```

---

# Learnings

Building WorkSync helped me understand:

* multi-tenant system design
* RBAC implementation
* backend architecture patterns
* secure API development
* SQL query optimization
* scalable project structure

---

# Future Improvements

* Rate limiting per tenant
* Email-based invitation system
* Real-time notifications using WebSockets
