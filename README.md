# 🚀 Collaborative Task Manager

A **full‑stack, real‑time collaborative task management system** built with **React, Node.js, Prisma, PostgreSQL, Socket.IO, and Docker**.  
The application allows multiple users to create, assign, track, and update tasks with **live updates and notifications** — all containerized and runnable with a **single Docker command**.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure user registration and login
- Password hashing with **bcrypt**
- JWT‑based authentication
- Protected routes (frontend + backend)

### ✅ Task Management
- Create tasks with:
  - Title
  - Priority (LOW / MEDIUM / HIGH / URGENT)
  - Due date
  - Status (TODO / IN_PROGRESS / REVIEW / COMPLETED)
- Update task status in real time
- Delete tasks

### 👥 Task Assignment
- Assign tasks to yourself or other users
- Display assigned user **name instead of ID**
- Separate views:
  - All tasks
  - Created by me
  - Assigned to me
  - Overdue tasks

### 🔔 Real‑Time Updates (Socket.IO)
- Live task updates across all connected users
- Instant UI updates without page refresh
- Real‑time toast notification when:
  - A task is assigned to you
  - A task is updated or deleted

### ⚡ Modern Frontend Stack
- **React + TypeScript**
- **React Query** for server state management
- **Axios** with auth interceptor
- Component‑based UI with clean state handling

### 🐳 Dockerized Setup
- Fully containerized **Frontend, Backend, and Database**
- One‑command startup using **docker‑compose**
- Automatic Prisma migrations on container start

---

## 🧱 Tech Stack

### Frontend
- React
- TypeScript
- React Router
- React Query
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- Socket.IO
- JWT Authentication

### Database
- PostgreSQL

### DevOps
- Docker
- Docker Compose

---

## 🏗️ System Architecture

```
┌──────────────────┐
│   Web Browser    │
│  (React Client)  │
└────────┬─────────┘
         │ HTTP (REST APIs)
         │ WebSocket (Socket.IO)
         ▼
┌───────────────────────────┐
│        Frontend           │
│  React + React Query      │
│  Axios + Socket.IO Client │
└────────┬──────────────────┘
         │
         ▼
┌───────────────────────────┐
│         Backend           │
│ Node.js + Express         │
│ Prisma ORM                │
│ JWT Auth                  │
│ Socket.IO Server          │
└────────┬──────────────────┘
         │
         ▼
┌───────────────────────────┐
│        PostgreSQL         │
│   Docker Volume Storage   │
└───────────────────────────┘
```

### 🔄 Real‑Time Flow
1. User performs action (create / update / assign task)
2. Backend updates database via Prisma
3. Backend emits Socket.IO event
4. All connected clients update UI instantly

---

## 🐳 Docker Setup

### Prerequisites
- Docker Desktop installed
- Docker Compose enabled

### One‑Command Start

```bash
docker-compose up --build
```

### Services
| Service | Port |
|-------|------|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:4000 |
| Database | 5432 |

---

## 🧬 Database & Prisma

- Prisma schema defines relations between:
  - User
  - Task
  - (Optional) Notification
- Migrations are automatically applied on container startup:

```bash
npx prisma migrate deploy
```

No manual DB setup required.

---

## 🔐 Environment Variables

### Backend (`docker-compose.yml`)

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taskdb
JWT_SECRET=docker_secret
```

### Frontend
- API and Socket URLs are container‑based
- No `.env` required for local Docker usage

---

## 🧪 Testing the App

1. Register two users
2. Login as User A
3. Create a task
4. Assign task to User B
5. Login as User B in another browser
6. Observe real‑time notification + task update

---

## 🚀 Deployment Readiness

The project is **production‑ready** with:
- Stateless backend
- Persistent DB volumes
- Real‑time communication
- Clear separation of concerns

Can be deployed to:
- Render
- Railway
- Fly.io
- AWS / GCP / Azure

---

## 📌 Future Enhancements
- Persistent notifications table
- Email notifications
- Role‑based access control
- Task comments
- Activity audit logs

---

## 👤 Author

Built as a **full‑stack real‑time systems project** demonstrating:
- Modern frontend architecture
- Scalable backend design
- Real‑time communication
- Production‑grade Dockerization

---

## ⭐ Final Note

This project showcases **end‑to‑end system design**, not just CRUD.
It highlights how real‑time applications are built, scaled, and deployed in modern production environments.

---

Happy Building 🚀

