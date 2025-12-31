# 🚀 Collaborative Task Manager (TaskFlow)

A full-stack, **real-time collaborative task management system** built with **React, Node.js, Prisma, PostgreSQL, Socket.IO, and Docker**.

This project was developed as a **final-year learning project** to understand **real-time communication, authentication, task workflows, and basic system design** used in modern web applications.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes on both frontend and backend

### ✅ Task Management
- Create, update, and delete tasks
- Task fields include:
  - Title
  - Priority (LOW / MEDIUM / HIGH / URGENT)
  - Due date
  - Status (TODO / IN_PROGRESS / REVIEW / COMPLETED)
- Real-time task status updates

### 👥 Task Assignment
- Assign tasks to yourself or other users
- Display assigned user name
- Task views:
  - All tasks
  - Created by me
  - Assigned to me
  - Overdue tasks

### 🔔 Real-Time Updates (Socket.IO)
- Live task updates across connected users
- UI updates instantly without page refresh
- Real-time notifications when:
  - A task is assigned
  - A task is updated or deleted

---

## 🧰 Tech Stack

### Frontend
- React
- TypeScript
- React Router
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

### DevOps / Tools
- Docker
- Docker Compose

---

## 🏗️ System Architecture (High Level)

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

- REST APIs handle authentication and task operations
- Socket.IO enables real-time synchronization
- Database changes trigger Socket.IO events
- All connected clients receive updates instantly

---

## 🔄 Real-Time Flow

1. User performs an action (create / update / assign task)
2. Backend updates the database using Prisma
3. Backend emits a Socket.IO event
4. Connected clients update their UI in real time

---

## 🐳 Docker Setup (Optional)

The project supports Docker Compose for simplified local setup of:
- Frontend
- Backend
- Database

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

👤 Author

Suhash Kowsick
Aspiring Software Engineer  |
Interested in backend development, real-time systems, and full-stack applications
---

## ⭐ Final Note

This project focuses on demonstrating real-time collaboration patterns and core full-stack development concepts in a practical application.

---

Happy Building 🚀

