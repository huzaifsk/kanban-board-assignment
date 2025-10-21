// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controllers");
const auth = require("../middleware/auth.middleware");
const { validateCreateTask, validateUpdateTask } = require("../middleware/validation.middleware");
const { apiLimiter } = require("../middleware/rateLimiter.middleware");


router.use(apiLimiter);

// GET /tasks
router.get("/", taskController.getTasks);

// POST /tasks
router.post("/", auth, validateCreateTask, taskController.createTask);

// PUT /tasks/:id
router.put("/:id", auth, validateUpdateTask, taskController.updateTask);

// DELETE /tasks/:id
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
