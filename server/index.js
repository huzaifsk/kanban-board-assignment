// index.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors"); // Required for frontend connection
const socket = require("./socket");
require("dotenv").config();

const app = express();
const server = http.createServer(app);


const io = socket.init(server);

app.use(express.json()); 

// CORS Configuration - Allow multiple origins
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : [
      'https://kanban-board-assignment-lake.vercel.app',
      'https://kanban-board-assignment-git-main-huzaif-projects.vercel.app',
      'https://kanban-board-assignment-9zg6yr8ve-huzaif-projects.vercel.app',
      'http://localhost:5173', 
      'http://localhost:3000', 
      'http://localhost:5174'
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel preview pattern
    if (allowedOrigins.indexOf(origin) !== -1 || 
        origin.includes('vercel.app') ||
        allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow anyway for debugging - change to false in strict production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


app.use("/auth", require("./routes/auth.routes"));
app.use("/tasks", require("./routes/task.routes"));

app.get("/", (req, res) => res.send("Kanban Backend Running!"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}` 
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack })
  });
});


const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;