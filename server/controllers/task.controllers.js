// controllers/taskController.js
const Task = require("../models/task.model");
const socket = require("../socket"); 

const isAuthorized = (req, task) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  return userRole === "admin" || task.createdBy.toString() === userId;
};

// POST /tasks: Create new task (auth required) [cite: 19]
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, position } = req.body;

    const newTask = new Task({
      title,
      description,
      status: status || "To Do",
      position: position || 0,
      createdBy: req.user.id,
    });

    newTask.auditLog.push({
      action: "create",
      performedBy: req.user.id,
    });

    const task = await newTask.save();

    await task.populate("createdBy", "username");

    socket.getIO().emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err.message);
    res.status(500).json({ 
      msg: "Error creating task",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// GET /tasks
exports.getTasks = async (req, res) => {
  try {

    const { search, sortBy, order, status } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } }, // case-insensitive
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && ['To Do', 'In Progress', 'Done'].includes(status)) {
      filter.status = status;
    }

    let sortOptions = {};
    if (sortBy) {
      const allowedSortFields = ['title', 'status', 'createdAt', 'updatedAt', 'position'];
      if (allowedSortFields.includes(sortBy)) {
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;
      }
    } else {
      sortOptions.position = 1;
    }

    const tasks = await Task.find(filter)
      .populate("createdBy", "username")
      .sort(sortOptions);

    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err.message);
    res.status(500).json({ 
      msg: "Error fetching tasks",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// PUT /tasks/:id:
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (!isAuthorized(req, task)) {
      return res.status(403).json({
        msg: "Unauthorized: Only the creator or admin can update this task.",
      });
    }

    const updates = req.body;
    const changes = {}; 

    for (const key in updates) {
      // Check if the property exists and is actually different
      if (task[key] !== undefined && task[key] !== updates[key]) {
        changes[key] = { old: task[key], new: updates[key] };
        task[key] = updates[key];
      }
    }

    if (Object.keys(changes).length > 0) {
      task.auditLog.push({
        action: "edit",
        performedBy: req.user.id,
        details: changes,
      });
    }

    const updatedTask = await task.save();

    await updatedTask.populate("createdBy", "username");

    socket.getIO().emit("taskUpdated", updatedTask);

    res.json(updatedTask);
  } catch (err) {
    console.error("Update Task Error:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(500).json({ 
      msg: "Error updating task",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (!isAuthorized(req, task)) {
      return res.status(403).json({
        msg: "Unauthorized: Only the creator or admin can delete this task.",
      });
    }

    const taskId = req.params.id;

    console.log(
      `AUDIT LOG: Task ${taskId} deleted by ${req.user.id} (${req.user.role})`
    );

    await Task.deleteOne({ _id: taskId });

    socket.getIO().emit("taskDeleted", taskId);

    res.json({ msg: "Task removed", id: taskId });
  } catch (err) {
    console.error("Delete Task Error:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(500).json({ 
      msg: "Error deleting task",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};
