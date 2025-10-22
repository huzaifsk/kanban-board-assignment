# 📋 Kanban Board - Full Stack Application

A modern, feature-rich Kanban board application with real-time updates, drag-and-drop functionality, and role-based access control.

![Kanban Board](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Socket.IO](https://img.shields.io/badge/Real--time-Socket.IO-orange)

## ✨ Features

### 🎨 Modern UI/UX
- SVG pattern background
- Toast notifications for user feedback
- User avatars with random colors

### 🔐 Authentication & Authorization
- JWT-based authentication (5-hour token expiration)
- Role-based access control (Admin/User)
- Password hashing with bcryptjs
- Rate limiting on auth routes (5 requests/15min)
- Protected routes

### 📝 Task Management
- **Create** tasks with title and description
- **Read** all tasks grouped by status
- **Update** tasks (double-click to edit)
- **Delete** tasks with confirmation
- **Drag & Drop** tasks between columns (To Do → In Progress → Done)
- Optimistic UI updates with rollback on error
- Search tasks by title/description
- Filter tasks by status
- Sort tasks by multiple fields (position, title, date)

### 📊 Advanced Features
- **Audit Logs**: Track all task changes with timestamps and user info
- **Real-time Updates**: Socket.IO for live collaboration
- **Health Check**: Server ping every 5 seconds
- **User Avatars**: Consistent color-coded initials
- **Permissions**: Read-only access for non-owners

### 🎯 Technical Highlights
- Custom hooks for code reusability
- Modular architecture
- Production-ready error handling
- Input validation with express-validator
- CORS configuration for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kanban-board-assignment.git
   cd kanban-board-assignment
   ```

2. **Set up Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Set up Frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env.local
   # Edit .env.local with backend URL (http://localhost:5001)
   nodemon index.js
   ```

4. **Seed Admin User** (Mandatory for admin access)
   ```bash
   cd ../server
   npm run seed
   # Default admin credentials: admin/pass123
   ```

5. **Access the application**
   - Frontend: http://localhost:5173 (or 5174)
   - Backend: http://localhost:5001
   - Health Check: http://localhost:5001/health

## 📦 Project Structure

```
kanban-board-assignment/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/          # Components
│   │   │   └── UserAvatar/         # Avatar component
│   │   ├── hooks/                  # Custom hooks
│   │   ├── layouts/                # AuthLayout, MainLayout
│   │   ├── pages/                  # Login, Register, Dashboard
│   │   └── config/                 # API configuration
│   ├── vercel.json                 # Vercel config
│   └── package.json
│
├── server/                          # Express Backend
│   ├── controllers/                # Business logic
│   ├── middleware/                 # Auth, validation, rate limiting
│   ├── models/                     # Mongoose schemas
│   ├── routes/                     # API routes
│   ├── socket.js                   # Socket.IO configuration
│   ├── vercel.json                 # Vercel config
│   └── package.json
│
└── README.md                        # This file
```


## 🔧 Environment Variables

### Backend (.env)
```bash
MONGO_URI=mongodb+srv://username:password@cluster...
JWT_SECRET=not_your_idea
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (.env.local)
```bash
VITE_API_URL=https://your-backend.vercel.app
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Task Endpoints
- `GET /tasks` - Get all tasks (with search, filter, sort)
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Health Check
- `GET /health` - Server health status

### Query Parameters (GET /tasks)
- `search` - Search by title/description
- `status` - Filter by status (To Do, In Progress, Done)
- `sortBy` - Sort field (position, title, createdAt, updatedAt)
- `order` - Sort order (asc, desc)

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite (Rolldown)
- **Routing**: React Router DOM 7.9.4
- **UI/UX**: 
  - Lucide React (icons)
  - Sonner (toast notifications)
  - Custom CSS with glassmorphism
- **Real-time**: Socket.IO Client 4.8.1
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.19.2
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.2
- **Validation**: express-validator 7.2.1
- **Security**: 
  - CORS
  - express-rate-limit 7.1.5
- **Real-time**: Socket.IO 4.8.1

## 👥 User Roles

### Admin
- Full CRUD access to all tasks
- Can edit/delete any task
- Can see all audit logs

### User
- Can create tasks
- Can edit/delete own tasks
- Read-only access to others' tasks
- Can see audit logs for accessible tasks

## 🎮 Usage

### First Time Setup
1. Register a new account
2. Or use seeded admin: `admin` / `pass123`
3. Create your first task
4. Drag tasks between columns
5. Double-click a task to edit
6. Use search/filter/sort controls

### Keyboard Shortcuts
- Double-click task card to edit
- ESC to close modals


**Built with ❤️ using React, Node.js, and MongoDB**

